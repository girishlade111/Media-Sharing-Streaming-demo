import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import { config } from './config/env';
import { logger } from './utils/logger';
import { registerRoutes } from './routes';
import { prisma } from './services/prisma';
import { redis } from './services/redis';

async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.logging.level,
      transport: config.app.nodeEnv === 'development' 
        ? { target: 'pino-pretty', options: { translateTime: true, colorize: true } }
        : undefined,
    },
  });

  // Register plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: config.app.nodeEnv === 'production',
  });

  await fastify.register(cors, {
    origin: config.cors.origins,
    credentials: true,
  });

  await fastify.register(jwt, {
    secret: config.auth.jwtSecret,
    sign: {
      expiresIn: config.auth.jwtExpiresIn,
    },
  });

  await fastify.register(cookie, {
    secret: config.auth.sessionSecret,
  });

  await fastify.register(rateLimit, {
    max: config.rateLimit.maxRequests,
    timeWindow: config.rateLimit.windowMs,
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: config.upload.maxFileSize,
    },
  });

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // API routes
  await registerRoutes(fastify);

  // Error handling
  fastify.setErrorHandler((error, request, reply) => {
    logger.error({
      err: error,
      method: request.method,
      url: request.url,
      userId: request.user?.sub,
    }, 'Request error');

    reply.status(error.statusCode || 500).send({
      error: error.name,
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  });

  // Graceful shutdown
  const onClose = async () => {
    logger.info('Shutting down...');
    await prisma.$disconnect();
    await redis.quit();
    logger.info('Shutdown complete');
  };

  fastify.addHook('onClose', async () => {
    await onClose();
  });

  return fastify;
}

async function start() {
  try {
    const fastify = await buildApp();

    await fastify.listen({
      port: config.app.port,
      host: '0.0.0.0',
    });

    logger.info(`🚀 Server running at http://localhost:${config.app.port}`);
    logger.info(`📊 Environment: ${config.app.nodeEnv}`);
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

start();
