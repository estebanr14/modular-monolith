import { z } from 'zod';

export const configZodSchema = z.object({
  NODE_ENV: z.enum(['local', 'development', 'production', 'staging']),
  APP_PORT: z.string().transform((val) => parseInt(val, 10)),
  BACKOFFICE_PORT: z.string().transform((val) => parseInt(val, 10)),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  DEFAULT_TIMEOUT_MS: z.string().transform((val) => parseInt(val, 10)),
  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string(),
  ENCRYPTION_KEY: z.string().length(32),
  SENDGRID_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
});
