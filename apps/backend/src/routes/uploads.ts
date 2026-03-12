import { FastifyInstance } from 'fastify';
import { spaces } from '../services/spaces';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const uploadUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
  mediaType: z.enum(['image', 'video', 'document']),
});

export async function uploadRoutes(fastify: FastifyInstance) {
  // Get presigned upload URL
  fastify.get(
    '/uploads/presigned',
    {
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
          required: ['fileName', 'fileType', 'fileSize', 'mediaType'],
          properties: {
            fileName: { type: 'string' },
            fileType: { type: 'string' },
            fileSize: { type: 'number' },
            mediaType: { type: 'string', enum: ['image', 'video', 'document'] },
          },
        },
      },
    },
    async (request, reply) => {
      const query = uploadUrlSchema.parse(request.query);
      const userId = request.user?.sub;

      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      // Validate file size limits
      const sizeLimits = {
        image: fastify['config'].upload.maxImageSize,
        video: fastify['config'].upload.maxVideoSize,
        document: fastify['config'].upload.maxDocumentSize,
      };

      if (query.fileSize > sizeLimits[query.mediaType]) {
        return reply.code(400).send({
          error: 'File too large',
          message: `Maximum ${query.mediaType} size is ${sizeLimits[query.mediaType] / 1024 / 1024}MB`,
        });
      }

      // Generate unique storage key
      const ext = query.fileName.split('.').pop() || 'bin';
      const storageKey = `uploads/posts/${userId}/${uuidv4()}.${ext}`;

      // Generate presigned URL
      const { url } = await spaces.generateUploadUrl(
        storageKey,
        query.fileType,
        3600 // 1 hour expiry
      );

      return reply.send({
        uploadUrl: url,
        storageKey,
        cdnUrl: spaces.getCdnUrl(storageKey),
        expiresAt: Date.now() + 3600 * 1000,
      });
    }
  );

  // Initiate multipart upload
  fastify.post(
    '/uploads/multipart/init',
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
          required: ['fileName', 'fileType', 'mediaType'],
          properties: {
            fileName: { type: 'string' },
            fileType: { type: 'string' },
            mediaType: { type: 'string', enum: ['image', 'video', 'document'] },
          },
        },
      },
    },
    async (request, reply) => {
      const body = uploadUrlSchema.parse(request.body);
      const userId = request.user?.sub;

      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const ext = body.fileName.split('.').pop() || 'bin';
      const storageKey = `uploads/posts/${userId}/${uuidv4()}.${ext}`;

      const { uploadId, url } = await spaces.initiateMultipartUpload(
        storageKey,
        body.fileType
      );

      return reply.send({
        uploadId,
        initiateUrl: url,
        storageKey,
        cdnUrl: spaces.getCdnUrl(storageKey),
      });
    }
  );

  // Get presigned URL for upload part
  fastify.get(
    '/uploads/multipart/part',
    {
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
          required: ['storageKey', 'uploadId', 'partNumber'],
          properties: {
            storageKey: { type: 'string' },
            uploadId: { type: 'string' },
            partNumber: { type: 'number' },
          },
        },
      },
    },
    async (request, reply) => {
      const query = request.query as {
        storageKey: string;
        uploadId: string;
        partNumber: number;
      };

      const url = await spaces.generateUploadPartUrl(
        query.storageKey,
        query.uploadId,
        query.partNumber
      );

      return reply.send({ uploadUrl: url });
    }
  );

  // Complete multipart upload
  fastify.post(
    '/uploads/multipart/complete',
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
          required: ['storageKey', 'uploadId', 'parts'],
          properties: {
            storageKey: { type: 'string' },
            uploadId: { type: 'string' },
            parts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  partNumber: { type: 'number' },
                  etag: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        storageKey: string;
        uploadId: string;
        parts: { partNumber: number; etag: string }[];
      };

      const location = await spaces.completeMultipartUpload(
        body.storageKey,
        body.uploadId,
        body.parts
      );

      return reply.send({
        location,
        cdnUrl: spaces.getCdnUrl(body.storageKey),
      });
    }
  );

  // Abort multipart upload
  fastify.delete(
    '/uploads/multipart/abort',
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
          required: ['storageKey', 'uploadId'],
          properties: {
            storageKey: { type: 'string' },
            uploadId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      // Note: This would need implementation in spaces service
      return reply.send({ message: 'Upload aborted' });
    }
  );
}
