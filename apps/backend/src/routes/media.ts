import { FastifyInstance } from 'fastify';
import { prisma } from '../services/prisma';
import { spaces } from '../services/spaces';
import { z } from 'zod';

const createMediaSchema = z.object({
  storageKey: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  fileSize: z.number(),
  duration: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export async function mediaRoutes(fastify: FastifyInstance) {
  // Get user's media
  fastify.get('/media', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    }],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20, maximum: 100 },
          type: { type: 'string', enum: ['image', 'video', 'document'] },
        },
      },
    },
    handler: async (request, reply) => {
      const userId = request.user?.sub;
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const query = request.query as {
        page?: number;
        limit?: number;
        type?: string;
      };

      const page = query.page || 1;
      const limit = Math.min(query.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: any = { userId };

      if (query.type) {
        if (query.type === 'image') {
          where.mimeType = { startsWith: 'image/' };
        } else if (query.type === 'video') {
          where.mimeType = { startsWith: 'video/' };
        } else if (query.type === 'document') {
          where.mimeType = {
            in: [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-powerpoint',
              'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'text/plain',
            ],
          };
        }
      }

      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.media.count({ where }),
      ]);

      return reply.send({
        media,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    },
  });

  // Get single media
  fastify.get('/media/:id', {
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };

      const media = await prisma.media.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      });

      if (!media) {
        return reply.code(404).send({ error: 'Not found' });
      }

      // Check visibility
      const postMedia = await prisma.postMedia.findFirst({
        where: { mediaId: id },
        include: {
          post: {
            select: {
              visibility: true,
              userId: true,
            },
          },
        },
      });

      if (
        postMedia?.post.visibility === 'PRIVATE' &&
        postMedia.post.userId !== request.user?.sub &&
        request.user?.role !== 'ADMIN'
      ) {
        return reply.code(403).send({ error: 'Forbidden' });
      }

      // Track view/download
      await prisma.analytics.create({
        data: {
          userId: request.user?.sub || null,
          eventType: media.mimeType.startsWith('video/') ? 'PLAY' : 'DOWNLOAD',
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        },
      });

      return reply.send(media);
    },
  });

  // Register uploaded media (after upload to Spaces)
  fastify.post(
    '/media',
    {
      preHandler: [async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
      }],
      schema: {
        body: {
          type: 'object',
          required: ['storageKey', 'originalName', 'mimeType', 'fileSize'],
          properties: {
            storageKey: { type: 'string' },
            originalName: { type: 'string' },
            mimeType: { type: 'string' },
            fileSize: { type: 'number' },
            duration: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.sub;
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const body = createMediaSchema.parse(request.body);

      // Determine if transcoding is needed
      let transcodeStatus = 'NOT_REQUIRED';
      if (body.mimeType.startsWith('video/')) {
        transcodeStatus = 'PENDING';
      }

      const cdnUrl = spaces.getCdnUrl(body.storageKey);

      const media = await prisma.media.create({
        data: {
          userId,
          originalName: body.originalName,
          storageKey: body.storageKey,
          mimeType: body.mimeType,
          fileSize: BigInt(body.fileSize),
          duration: body.duration,
          width: body.width,
          height: body.height,
          status: 'PROCESSING',
          transcodeStatus,
          cdnUrl,
          thumbnailUrl: body.mimeType.startsWith('video/')
            ? `${cdnUrl}/thumbnail.jpg`
            : undefined,
        },
      });

      // If video, queue for transcoding
      if (body.mimeType.startsWith('video/') && fastify['config'].transcode.enabled) {
        // Send to queue (would use BullMQ in production)
        fastify.log.info({ mediaId: media.id }, 'Queued for transcoding');
      } else {
        // Mark as completed
        await prisma.media.update({
          where: { id: media.id },
          data: { status: 'COMPLETED' },
        });
      }

      // Track upload analytics
      await prisma.analytics.create({
        data: {
          userId,
          eventType: 'UPLOAD',
        },
      });

      return reply.code(201).send(media);
    }
  );

  // Delete media
  fastify.delete(
    '/media/:id',
    {
      preHandler: [async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
      }],
    },
    async (request, reply) => {
      const userId = request.user?.sub;
      const { id } = request.params as { id: string };

      const media = await prisma.media.findUnique({ where: { id } });

      if (!media) {
        return reply.code(404).send({ error: 'Not found' });
      }

      if (media.userId !== userId && request.user?.role !== 'ADMIN') {
        return reply.code(403).send({ error: 'Forbidden' });
      }

      // Delete from Spaces
      await spaces.deleteFile(media.storageKey);

      // Delete from database
      await prisma.media.delete({ where: { id } });

      return reply.send({ message: 'Media deleted' });
    }
  );

  // Get signed URL for media access
  fastify.get(
    '/media/:id/url',
    {
      preHandler: [async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch {
          // Allow public access for PUBLIC content
        }
      }],
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const media = await prisma.media.findUnique({
        where: { id },
        include: {
          user: true,
          posts: {
            include: {
              post: {
                select: { visibility: true },
              },
            },
          },
        },
      });

      if (!media) {
        return reply.code(404).send({ error: 'Not found' });
      }

      // Check if media is in any post and check visibility
      const isPrivate = media.posts.some(
        (pm) => pm.post.visibility === 'PRIVATE'
      );

      if (
        isPrivate &&
        media.userId !== request.user?.sub &&
        request.user?.role !== 'ADMIN'
      ) {
        return reply.code(403).send({ error: 'Forbidden' });
      }

      // Generate signed URL (1 hour expiry)
      const signedUrl = await spaces.generateDownloadUrl(
        media.storageKey,
        3600
      );

      return reply.send({
        url: signedUrl,
        cdnUrl: spaces.getCdnUrl(media.storageKey),
        expiresAt: Date.now() + 3600 * 1000,
      });
    }
  );
}
