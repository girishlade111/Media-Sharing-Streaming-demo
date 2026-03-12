import { Queue, Worker, Job } from 'bullmq';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { prisma } from '../services/prisma';
import { spaces } from '../services/spaces';
import ffmpeg from 'fluent-ffmpeg';
import { createWriteStream, createReadStream, unlinkSync } from 'fs';
import { pipeline } from 'stream/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

export interface TranscodeJob {
  mediaId: string;
  storageKey: string;
  mimeType: string;
  qualities: string[];
}

const connection = {
  url: config.redis.url,
  maxRetriesPerRequest: null,
};

export const transcodeQueue = new Queue('transcode', { connection });

const worker = new Worker(
  'transcode',
  async (job: Job<TranscodeJob>) => {
    const { mediaId, storageKey, qualities } = job.data;

    logger.info({ mediaId, job: job.id }, 'Starting transcoding job');

    try {
      // Update status
      await prisma.media.update({
        where: { id: mediaId },
        data: { transcodeStatus: 'PROCESSING' },
      });

      // Download original file
      const tempDir = join(tmpdir(), 'transcode', mediaId);
      const originalPath = join(tempDir, 'original.mp4');

      // Create temp directory
      const { mkdir } = await import('fs/promises');
      await mkdir(tempDir, { recursive: true });

      // Download from Spaces
      const downloadUrl = await spaces.generateDownloadUrl(storageKey, 3600);
      const downloadResponse = await fetch(downloadUrl);
      if (!downloadResponse.body) {
        throw new Error('Failed to download file');
      }

      await pipeline(
        downloadResponse.body as any,
        createWriteStream(originalPath)
      );

      logger.info({ mediaId }, 'Downloaded original file');

      // Transcode to different qualities
      const hlsBasePath = `transcodes/videos/${mediaId}`;
      const playlists: { quality: string; path: string; bandwidth: number }[] = [];

      for (const quality of qualities) {
        const qualityDir = join(tempDir, quality);
        await mkdir(qualityDir, { recursive: true });

        const outputPattern = join(qualityDir, 'segment_%03d.ts');
        const playlistPath = join(qualityDir, 'playlist.m3u8');

        // Get video info first
        const videoInfo = await getVideoInfo(originalPath);

        // Determine bitrate based on quality
        const bitrateMap: Record<string, { video: string; audio: string; bandwidth: number }> = {
          '1080p': { video: '5000k', audio: '192k', bandwidth: 5000000 },
          '720p': { video: '2800k', audio: '128k', bandwidth: 3000000 },
          '480p': { video: '1400k', audio: '128k', bandwidth: 1500000 },
          '360p': { video: '800k', audio: '96k', bandwidth: 800000 },
        };

        const settings = bitrateMap[quality] || bitrateMap['480p'];

        // Skip if source resolution is lower than target
        const targetHeight = parseInt(quality);
        if (videoInfo.height && videoInfo.height < targetHeight) {
          logger.info(
            { mediaId, quality, sourceHeight: videoInfo.height },
            'Skipping quality - source is lower resolution'
          );
          continue;
        }

        await transcodeVideo({
          input: originalPath,
          output: outputPattern,
          playlist: playlistPath,
          videoBitrate: settings.video,
          audioBitrate: settings.audio,
          height: targetHeight,
        });

        logger.info({ mediaId, quality }, 'Transcoded to quality');

        // Upload segments and playlist to Spaces
        const fs = await import('fs/promises');
        const files = await fs.readdir(qualityDir);

        for (const file of files) {
          const filePath = join(qualityDir, file);
          const fileContent = await fs.readFile(filePath);
          const uploadKey = `${hlsBasePath}/${quality}/${file}`;

          await spaces['client'].send(
            new (await import('@aws-sdk/client-s3')).PutObjectCommand({
              Bucket: config.spaces.bucket,
              Key: uploadKey,
              Body: fileContent,
              ContentType: file.endsWith('.m3u8')
                ? 'application/vnd.apple.mpegurl'
                : 'video/MP2T',
            })
          );
        }

        playlists.push({
          quality,
          path: `${hlsBasePath}/${quality}/playlist.m3u8`,
          bandwidth: settings.bandwidth,
        });
      }

      // Create master playlist
      let masterPlaylist = '#EXTM3U\n#EXT-X-VERSION:3\n';
      for (const playlist of playlists) {
        masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${playlist.bandwidth},RESOLUTION=${playlist.quality.replace('p', 'p')}\n${playlist.quality}/playlist.m3u8\n`;
      }

      const masterPlaylistKey = `${hlsBasePath}/master.m3u8`;
      await spaces['client'].send(
        new (await import('@aws-sdk/client-s3')).PutObjectCommand({
          Bucket: config.spaces.bucket,
          Key: masterPlaylistKey,
          Body: masterPlaylist,
          ContentType: 'application/vnd.apple.mpegurl',
        })
      );

      // Generate thumbnail
      const thumbnailPath = join(tempDir, 'thumbnail.jpg');
      await generateThumbnail(originalPath, thumbnailPath);

      const thumbnailContent = await (await import('fs/promises')).readFile(
        thumbnailPath
      );
      const thumbnailKey = `${hlsBasePath}/thumbnail.jpg`;
      await spaces['client'].send(
        new (await import('@aws-sdk/client-s3')).PutObjectCommand({
          Bucket: config.spaces.bucket,
          Key: thumbnailKey,
          Body: thumbnailContent,
          ContentType: 'image/jpeg',
        })
      );

      // Update media record
      await prisma.media.update({
        where: { id: mediaId },
        data: {
          status: 'COMPLETED',
          transcodeStatus: 'COMPLETED',
          hlsPlaylistUrl: spaces.getCdnUrl(masterPlaylistKey),
          thumbnailUrl: spaces.getCdnUrl(thumbnailKey),
        },
      });

      // Cleanup temp files
      await cleanupTempDir(tempDir);

      logger.info({ mediaId }, 'Transcoding completed successfully');

      // Track analytics
      await prisma.analytics.create({
        data: {
          eventType: 'TRANSCODE',
          metadata: { mediaId, qualities: playlists.map((p) => p.quality) },
        },
      });
    } catch (error) {
      logger.error({ mediaId, error }, 'Transcoding failed');

      await prisma.media.update({
        where: { id: mediaId },
        data: {
          status: 'COMPLETED', // Original is still available
          transcodeStatus: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  },
  {
    connection,
    concurrency: 2, // Limit concurrent transcodes
  }
);

worker.on('completed', (job) => {
  logger.info({ job: job.id, mediaId: job.data.mediaId }, 'Job completed');
});

worker.on('failed', (job, error) => {
  logger.error(
    { job: job?.id, mediaId: job?.data.mediaId, error },
    'Job failed'
  );
});

// Helper functions
async function getVideoInfo(filePath: string): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else {
        const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
        resolve({
          width: videoStream?.width,
          height: videoStream?.height,
        });
      }
    });
  });
}

async function transcodeVideo({
  input,
  output,
  playlist,
  videoBitrate,
  audioBitrate,
  height,
}: {
  input: string;
  output: string;
  playlist: string;
  videoBitrate: string;
  audioBitrate: string;
  height: number;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions([
        '-c:v libx264',
        `-b:v ${videoBitrate}`,
        '-c:a aac',
        `-b:a ${audioBitrate}`,
        `-vf scale=-2:${height}`,
        '-g 48',
        '-keyint_min 48',
        '-sc_threshold 0',
        '-f hls',
        '-hls_time 6',
        '-hls_playlist_type vod',
        `-hls_segment_filename ${output}`,
      ])
      .output(playlist)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });
}

async function generateThumbnail(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .screenshots({
        timestamps: ['10%'],
        filename: 'thumbnail.jpg',
        folder: output.replace('thumbnail.jpg', ''),
        size: '320x?',
      })
      .on('end', () => resolve())
      .on('error', reject);
  });
}

async function cleanupTempDir(dir: string): Promise<void> {
  const fs = await import('fs/promises');
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (error) {
    logger.error({ dir, error }, 'Failed to cleanup temp directory');
  }
}

export async function queueTranscode(mediaId: string): Promise<void> {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    throw new Error('Media not found');
  }

  if (!media.mimeType.startsWith('video/')) {
    throw new Error('Media is not a video');
  }

  await transcodeQueue.add('transcode', {
    mediaId,
    storageKey: media.storageKey,
    mimeType: media.mimeType,
    qualities: config.transcode.qualities,
  });
}
