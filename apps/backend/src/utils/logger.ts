import pino from 'pino';
import { config } from '../config/env';

export const logger = pino({
  level: config.logging.level,
  transport: config.app.nodeEnv === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:standard',
          colorize: true,
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: {
    env: config.app.nodeEnv,
  },
});
