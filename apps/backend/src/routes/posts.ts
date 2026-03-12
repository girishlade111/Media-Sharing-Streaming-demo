import { FastifyInstance } from 'fastify';
import { prisma } from '../services/prisma';
import { z } from 'zod';

const createPostSchema = z.object({
  content: z.string().max(5000).optional(),
  mediaIds: z.array(z.string().uuid()).optional(),
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'MIXED']).optional(),
  visibility: z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE']).optional(),
});

const updatePostSchema = z.object({
  content: z.string().max(5000).optional(),
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'MIXED']).optional(),
  visibility: z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE']).optional(),
  isPinned: z.boolean().optional(),
});

export async function postRoutes(fastify: FastifyInstance) {
  // Get feed
  fastify.get('/posts', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20, maximum: 100 },
          type: { type: 'string', enum: ['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'] },
          userId: { type: 'string' },
        },
      },
    },
    handler: async (request, reply) => {
      const query = request.query as {
        page?: number;
        limit?: number;
        type?: string;
        userId?: string;
      };

      const page = query.page || 1;
      const limit = Math.min(query.limit || 20, 100);
      const skip = (page - 1) * limit;

      const where: any = { visibility: 'PUBLIC' };

      if (query.type) {
        where.type = query.type;
      }

      if (query.userId) {
        where.userId = query.userId;
      }

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            media: {
              include: {
                media: {
                  select: {
                    id: true,
                    mimeType: true,
                    thumbnailUrl: true,
                    cdnUrl: true,
                    hlsPlaylistUrl: true,
                    duration: true,
                    width: true,
                    height: true,
                    fileSize: true,
                  },
                },
              },
              orderBy: { sortOrder: 'asc' },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' },
          ],
        }),
        prisma.post.count({ where }),
      ]);

      return reply.send({
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    },
  });

  // Get single post
  fastify.get('/posts/:id', {
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };

      const post = await prisma.post.findUnique({
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
          media: {
            include: {
              media: {
                select: {
                  id: true,
                  originalName: true,
                  mimeType: true,
                  thumbnailUrl: true,
                  cdnUrl: true,
                  hlsPlaylistUrl: true,
                  duration: true,
                  width: true,
                  height: true,
                  fileSize: true,
                  status: true,
                },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
          comments: {
            take: 10,
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
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      if (!post) {
        return reply.code(404).send({ error: 'Not found' });
      }

      // Track view
      await prisma.analytics.create({
        data: {
          postId: id,
          eventType: 'VIEW',
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        },
      });

      return reply.send(post);
    },
  });

  // Create post
  fastify.post(
    '/posts',
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
          properties: {
            content: { type: 'string', maxLength: 5000 },
            mediaIds: { type: 'array', items: { type: 'string' } },
            type: { type: 'string', enum: ['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'MIXED'] },
            visibility: { type: 'string', enum: ['PUBLIC', 'UNLISTED', 'PRIVATE'] },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.sub;
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const body = createPostSchema.parse(request.body);

      // Determine post type from media if not specified
      let postType = body.type || 'TEXT';
      if (body.mediaIds && body.mediaIds.length > 0 && !body.type) {
        const media = await prisma.media.findMany({
          where: { id: { in: body.mediaIds } },
          select: { mimeType: true },
        });

        const hasVideo = media.some((m) => m.mimeType.startsWith('video/'));
        const hasImage = media.some((m) => m.mimeType.startsWith('image/'));
        const hasDocument = media.some(
          (m) =>
            m.mimeType === 'application/pdf' ||
            m.mimeType.includes('document') ||
            m.mimeType.includes('office')
        );

        if (hasVideo && hasImage) postType = 'MIXED';
        else if (hasVideo) postType = 'VIDEO';
        else if (hasImage && media.length > 1) postType = 'IMAGE';
        else if (hasImage) postType = 'IMAGE';
        else if (hasDocument) postType = 'DOCUMENT';
      }

      const post = await prisma.post.create({
        data: {
          userId,
          content: body.content,
          type: postType,
          visibility: body.visibility || 'PUBLIC',
          media: body.mediaIds
            ? {
                create: body.mediaIds.map((mediaId, index) => ({
                  mediaId,
                  sortOrder: index,
                })),
              }
            : undefined,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          media: {
            include: {
              media: true,
            },
          },
        },
      });

      return reply.code(201).send(post);
    }
  );

  // Update post
  fastify.patch(
    '/posts/:id',
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
      const body = updatePostSchema.parse(request.body);

      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        return reply.code(404).send({ error: 'Not found' });
      }

      if (post.userId !== userId && request.user?.role !== 'ADMIN') {
        return reply.code(403).send({ error: 'Forbidden' });
      }

      const updated = await prisma.post.update({
        where: { id },
        data: body,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          media: {
            include: { media: true },
          },
        },
      });

      return reply.send(updated);
    }
  );

  // Delete post
  fastify.delete(
    '/posts/:id',
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

      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        return reply.code(404).send({ error: 'Not found' });
      }

      if (post.userId !== userId && request.user?.role !== 'ADMIN') {
        return reply.code(403).send({ error: 'Forbidden' });
      }

      await prisma.post.delete({ where: { id } });

      return reply.send({ message: 'Post deleted' });
    }
  );

  // Like post
  fastify.post(
    '/posts/:id/like',
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

      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      try {
        await prisma.like.create({
          data: {
            userId,
            postId: id,
          },
        });

        // Track analytics
        await prisma.analytics.create({
          data: {
            postId: id,
            userId,
            eventType: 'LIKE',
          },
        });
      } catch {
        // Already liked
      }

      const likeCount = await prisma.like.count({ where: { postId: id } });
      return reply.send({ liked: true, count: likeCount });
    }
  );

  // Unlike post
  fastify.delete(
    '/posts/:id/like',
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

      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      await prisma.like.deleteMany({
        where: { userId, postId: id },
      });

      const likeCount = await prisma.like.count({ where: { postId: id } });
      return reply.send({ liked: false, count: likeCount });
    }
  );

  // Add comment
  fastify.post(
    '/posts/:id/comments',
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
          required: ['content'],
          properties: {
            content: { type: 'string', minLength: 1, maxLength: 2000 },
            parentId: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.sub;
      const { id } = request.params as { id: string };
      const { content, parentId } = request.body as {
        content: string;
        parentId?: string;
      };

      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const comment = await prisma.comment.create({
        data: {
          postId: id,
          userId,
          content,
          parentId: parentId || null,
        },
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

      // Track analytics
      await prisma.analytics.create({
        data: {
          postId: id,
          userId,
          eventType: 'COMMENT',
        },
      });

      return reply.code(201).send(comment);
    }
  );
}
