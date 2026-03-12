import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Application
  APP_URL: z.string().url().default('http://localhost:3000'),
  API_URL: z.string().url().default('http://localhost:4000'),
  API_PORT: z.string().default('4000'),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  
  // DigitalOcean Spaces
  DO_SPACES_KEY: z.string().min(1),
  DO_SPACES_SECRET: z.string().min(1),
  DO_SPACES_ENDPOINT: z.string().url(),
  DO_SPACES_REGION: z.string().default('nyc3'),
  DO_SPACES_BUCKET: z.string().min(1),
  DO_SPACES_CDN_URL: z.string().url().optional(),
  
  // Authentication
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SESSION_SECRET: z.string().min(32),
  
  // Upload Limits (in bytes)
  MAX_FILE_SIZE: z.string().default('5368709120'), // 5GB
  MAX_IMAGE_SIZE: z.string().default('10485760'), // 10MB
  MAX_VIDEO_SIZE: z.string().default('5368709120'), // 5GB
  MAX_DOCUMENT_SIZE: z.string().default('104857600'), // 100MB
  
  // Video Transcoding
  TRANSCODE_ENABLED: z.string().default('true'),
  TRANSCODE_QUALITIES: z.string().default('1080p,720p,480p,360p'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  
  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  
  // Logging
  LOG_LEVEL: z.string().default('debug'),
  
  // Worker mode
  WORKER_MODE: z.string().default('false'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.format());
    process.exit(1);
  }
  
  return result.data;
}

export const env = loadEnv();

export const config = {
  app: {
    url: env.APP_URL,
    apiUrl: env.API_URL,
    port: parseInt(env.API_PORT, 10),
    nodeEnv: env.NODE_ENV,
  },
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
  spaces: {
    key: env.DO_SPACES_KEY,
    secret: env.DO_SPACES_SECRET,
    endpoint: env.DO_SPACES_ENDPOINT,
    region: env.DO_SPACES_REGION,
    bucket: env.DO_SPACES_BUCKET,
    cdnUrl: env.DO_SPACES_CDN_URL,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    sessionSecret: env.SESSION_SECRET,
  },
  upload: {
    maxFileSize: parseInt(env.MAX_FILE_SIZE, 10),
    maxImageSize: parseInt(env.MAX_IMAGE_SIZE, 10),
    maxVideoSize: parseInt(env.MAX_VIDEO_SIZE, 10),
    maxDocumentSize: parseInt(env.MAX_DOCUMENT_SIZE, 10),
  },
  transcode: {
    enabled: env.TRANSCODE_ENABLED === 'true',
    qualities: env.TRANSCODE_QUALITIES.split(','),
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  cors: {
    origins: env.CORS_ORIGINS.split(','),
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  worker: {
    mode: env.WORKER_MODE === 'true',
  },
};
