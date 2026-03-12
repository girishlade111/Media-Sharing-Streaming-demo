import { FastifyInstance } from 'fastify';
import { AuthService, CreateUserInput, LoginInput } from '../services/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(100),
  displayName: z.string().min(1).max(50).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);

  // Register
  fastify.post(
    '/auth/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'username', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            username: { type: 'string', minLength: 3, maxLength: 30 },
            password: { type: 'string', minLength: 8, maxLength: 100 },
            displayName: { type: 'string', minLength: 1, maxLength: 50 },
          },
        },
      },
    },
    async (request, reply) => {
      const body = registerSchema.parse(request.body);

      // Check if user exists
      const existingUser = await authService.getUserById(body.email);
      if (existingUser) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: 'Email already registered',
        });
      }

      const user = await authService.createUser(body);
      const tokens = await authService.login(
        { email: body.email, password: body.password },
        request.headers['user-agent'],
        request.ip
      );

      return reply.send({ ...tokens, user });
    }
  );

  // Login
  fastify.post(
    '/auth/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const body = loginSchema.parse(request.body);

      const result = await authService.login(
        body,
        request.headers['user-agent'],
        request.ip
      );

      return reply.send(result);
    }
  );

  // Refresh token
  fastify.post(
    '/auth/refresh',
    {
      schema: {
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const body = refreshSchema.parse(request.body);
      const tokens = await authService.refreshAccessToken(body.refreshToken);
      return reply.send(tokens);
    }
  );

  // Logout
  fastify.post('/auth/logout', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    }],
    handler: async (request, reply) => {
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await authService.logout(token);
      }
      return reply.send({ message: 'Logged out successfully' });
    },
  });

  // Logout all sessions
  fastify.post('/auth/logout-all', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    }],
    handler: async (request, reply) => {
      const userId = request.user?.sub;
      if (userId) {
        await authService.logoutAll(userId);
      }
      return reply.send({ message: 'All sessions logged out' });
    },
  });

  // Get current user
  fastify.get('/auth/me', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
    }],
    handler: async (request, reply) => {
      const userId = request.user?.sub;
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
      const user = await authService.getUserById(userId);
      return reply.send(user);
    },
  });

  // Update profile
  fastify.patch('/auth/profile', {
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
          displayName: { type: 'string', minLength: 1, maxLength: 50 },
          bio: { type: 'string', minLength: 1, maxLength: 500 },
        },
      },
    },
    handler: async (request, reply) => {
      const userId = request.user?.sub;
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const { displayName, bio } = request.body as { displayName?: string; bio?: string };
      const user = await authService.updateProfile(userId, { displayName, bio });
      return reply.send(user);
    },
  });
}
