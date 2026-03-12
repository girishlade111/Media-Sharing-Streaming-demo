import 'dotenv/config';
import { logger } from '../utils/logger';
import { transcodeQueue } from './transcode';
import { redis } from '../services/redis';

async function startWorker() {
  logger.info('🔧 Starting background worker...');

  // Wait for Redis connection
  await new Promise<void>((resolve, reject) => {
    redis.on('connect', () => {
      logger.info('Connected to Redis');
      resolve();
    });
    redis.on('error', reject);
  });

  logger.info('✅ Worker started. Waiting for jobs...');

  // Keep the process alive
  process.on('SIGINT', async () => {
    logger.info('Shutting down worker...');
    await transcodeQueue.close();
    await redis.quit();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Shutting down worker...');
    await transcodeQueue.close();
    await redis.quit();
    process.exit(0);
  });
}

startWorker().catch((error) => {
  logger.error({ error }, 'Worker failed to start');
  process.exit(1);
});
