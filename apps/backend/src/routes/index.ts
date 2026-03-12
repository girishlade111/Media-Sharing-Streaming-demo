import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';
import { uploadRoutes } from './uploads';
import { postRoutes } from './posts';
import { mediaRoutes } from './media';

export async function registerRoutes(fastify: FastifyInstance) {
  // Register all routes
  await authRoutes(fastify);
  await uploadRoutes(fastify);
  await postRoutes(fastify);
  await mediaRoutes(fastify);

  // API info endpoint
  fastify.get('/api', async () => ({
    name: 'DigitalOcean Media Platform API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        refresh: 'POST /auth/refresh',
        logout: 'POST /auth/logout',
        me: 'GET /auth/me',
        profile: 'PATCH /auth/profile',
      },
      uploads: {
        presigned: 'GET /uploads/presigned',
        multipartInit: 'POST /uploads/multipart/init',
        multipartPart: 'GET /uploads/multipart/part',
        multipartComplete: 'POST /uploads/multipart/complete',
      },
      posts: {
        list: 'GET /posts',
        get: 'GET /posts/:id',
        create: 'POST /posts',
        update: 'PATCH /posts/:id',
        delete: 'DELETE /posts/:id',
        like: 'POST /posts/:id/like',
        unlike: 'DELETE /posts/:id/like',
        comment: 'POST /posts/:id/comments',
      },
      media: {
        list: 'GET /media',
        get: 'GET /media/:id',
        register: 'POST /media',
        delete: 'DELETE /media/:id',
        url: 'GET /media/:id/url',
      },
    },
  }));
}
