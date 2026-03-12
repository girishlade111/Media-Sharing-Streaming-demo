import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import {
  S3RequestPresigner,
  PresignedRequest,
} from '@aws-sdk/s3-request-presigner';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { config } from '../config/env';
import { logger } from '../utils/logger';

class SpacesService {
  private client: S3Client;
  private presigner: S3RequestPresigner;

  constructor() {
    this.client = new S3Client({
      region: config.spaces.region,
      endpoint: config.spaces.endpoint,
      credentials: {
        accessKeyId: config.spaces.key,
        secretAccessKey: config.spaces.secret,
      },
      forcePathStyle: false,
    });

    this.presigner = new S3RequestPresigner({
      credentials: {
        accessKeyId: config.spaces.key,
        secretAccessKey: config.spaces.secret,
      },
      region: config.spaces.region,
      sha256: false,
    });
  }

  /**
   * Generate a presigned URL for uploading
   */
  async generateUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<{ url: string; key: string }> {
    const command = new PutObjectCommand({
      Bucket: config.spaces.bucket,
      Key: key,
      ContentType: contentType,
    });

    const presignedRequest = await this.presigner.presign(
      new HttpRequest({
        hostname: this.client.config.endpoint!.hostname,
        path: `/${config.spaces.bucket}/${encodeURIComponent(key)}`,
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
      }),
      { expiresIn }
    );

    const url = presignedRequest.toString();
    logger.debug({ key, url }, 'Generated upload URL');

    return { url, key };
  }

  /**
   * Generate a presigned URL for downloading/viewing
   */
  async generateDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: config.spaces.bucket,
      Key: key,
    });

    const presignedRequest = await this.presigner.presign(
      new HttpRequest({
        hostname: this.client.config.endpoint!.hostname,
        path: `/${config.spaces.bucket}/${encodeURIComponent(key)}`,
        method: 'GET',
      }),
      { expiresIn }
    );

    return presignedRequest.toString();
  }

  /**
   * Generate a presigned URL for multipart upload initiation
   */
  async initiateMultipartUpload(
    key: string,
    contentType: string
  ): Promise<{ uploadId: string; url: string }> {
    const command = new CreateMultipartUploadCommand({
      Bucket: config.spaces.bucket,
      Key: key,
      ContentType: contentType,
    });

    const presignedRequest = await this.presigner.presign(
      new HttpRequest({
        hostname: this.client.config.endpoint!.hostname,
        path: `/${config.spaces.bucket}/${encodeURIComponent(key)}`,
        method: 'POST',
        query: { uploads: '' },
        headers: {
          'Content-Type': contentType,
        },
      }),
      { expiresIn: 3600 }
    );

    const response = await fetch(presignedRequest.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
    });

    const text = await response.text();
    const uploadId = text.match(/<UploadId>([^<]+)<\/UploadId>/)?.[1];

    if (!uploadId) {
      throw new Error('Failed to get upload ID');
    }

    return {
      uploadId,
      url: presignedRequest.toString(),
    };
  }

  /**
   * Generate presigned URL for uploading a part
   */
  async generateUploadPartUrl(
    key: string,
    uploadId: string,
    partNumber: number
  ): Promise<string> {
    const presignedRequest = await this.presigner.presign(
      new HttpRequest({
        hostname: this.client.config.endpoint!.hostname,
        path: `/${config.spaces.bucket}/${encodeURIComponent(key)}`,
        method: 'PUT',
        query: {
          uploadId,
          partNumber: partNumber.toString(),
        },
      }),
      { expiresIn: 3600 }
    );

    return presignedRequest.toString();
  }

  /**
   * Complete multipart upload
   */
  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { partNumber: number; etag: string }[]
  ): Promise<string> {
    const command = new CompleteMultipartUploadCommand({
      Bucket: config.spaces.bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((p) => ({
          PartNumber: p.partNumber,
          ETag: p.etag,
        })),
      },
    });

    const result = await this.client.send(command);
    return result.Location!;
  }

  /**
   * Delete a file
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: config.spaces.bucket,
      Key: key,
    });

    await this.client.send(command);
    logger.info({ key }, 'File deleted');
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string) {
    const command = new HeadObjectCommand({
      Bucket: config.spaces.bucket,
      Key: key,
    });

    return this.client.send(command);
  }

  /**
   * Get CDN URL for a key (if CDN is configured)
   */
  getCdnUrl(key: string): string {
    if (config.spaces.cdnUrl) {
      return `${config.spaces.cdnUrl}/${key}`;
    }
    return `${config.spaces.endpoint}/${config.spaces.bucket}/${key}`;
  }

  /**
   * List files in a prefix
   */
  async listFiles(prefix: string, maxKeys: number = 100) {
    const command = new ListObjectsV2Command({
      Bucket: config.spaces.bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });

    return this.client.send(command);
  }
}

export const spaces = new SpacesService();
