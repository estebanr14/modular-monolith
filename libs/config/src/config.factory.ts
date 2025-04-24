import { str } from 'envalid';
import { cleanEnv } from 'envalid';
import secretManagerConfig from './aws/secret-manager.config';
import { BaseConfig, Config } from './config.interface';
import { developmentConfig } from './environments/development.config';
import { localConfig } from './environments/local.config';
import { productionConfig } from './environments/production.config';
import { stagingConfig } from './environments/staging.config';

let cachedConfig: Config;

export default async (): Promise<Config> => {
  if (cachedConfig) return cachedConfig;

  const awsSecrets = await secretManagerConfig();
  const envVars = process.env;

  const env = cleanEnv(
    { ...awsSecrets, ...envVars },
    {
      NODE_ENV: str({ desc: 'Environment' }),
      APP_PORT: str({ desc: 'App Port' }),
      APP_NAME: str({ desc: 'App Name', choices: ['backend', 'backoffice'] }),
      JWT_SECRET: str({ desc: 'JWT Secret' }),
      JWT_REFRESH_SECRET: str({ desc: 'JWT Refresh Secret' }),
      SENDGRID_API_KEY: str({ desc: 'Sendgrid API Key' }),
      EMAIL_FROM: str({ desc: 'Email From', default: 'noreply@panizza.dev' }),
      BACKOFFICE_PORT: str({ desc: 'Backoffice Port' }),
      MONGO_URI: str({ desc: 'Mongo URI' }),
      MONGO_DB_NAME: str({ desc: 'Mongo DB Name' }),
      DEFAULT_TIMEOUT_MS: str({
        desc: 'Default Timeout in ms',
        default: '8000',
      }),
      ENCRYPTION_KEY: str({ desc: 'Encryption Key' }),
      SWAGGER_USERNAME: str({ desc: 'Swagger Username' }),
      SWAGGER_PASSWORD: str({ desc: 'Swagger Password' }),
      RABBIT_HOST: str({ desc: 'Rabbit Host' }),
      RABBIT_PORT: str({ desc: 'Rabbit Port' }),
      RABBIT_USER: str({ desc: 'Rabbit User' }),
      RABBIT_PASS: str({ desc: 'Rabbit Pass' }),
    },
  );

  Object.assign(process.env, env); //Just to make sure the env vars are available for the string value object

  const baseConfig: BaseConfig = {
    environment: env.NODE_ENV,
    jwtSecret: env.JWT_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    appPort: parseInt(env.APP_PORT, 10),
    appName: env.APP_NAME,
    backofficePort: parseInt(env.BACKOFFICE_PORT, 10),
    sendgridApiKey: env.SENDGRID_API_KEY,
    emailFrom: env.EMAIL_FROM,
    mongo: {
      uri: env.MONGO_URI,
      dbName: env.MONGO_DB_NAME,
    },
    defaultTimeoutMs: parseInt(env.DEFAULT_TIMEOUT_MS, 10),
    encryptionKey: env.ENCRYPTION_KEY,
    swaggerCredentials: {
      username: env.SWAGGER_USERNAME,
      password: env.SWAGGER_PASSWORD,
    },
    rabbit: {
      host: env.RABBIT_HOST,
      port: env.RABBIT_PORT,
      user: env.RABBIT_USER,
      pass: env.RABBIT_PASS,
    },
  };

  switch (baseConfig.environment) {
    case 'production':
      cachedConfig = productionConfig(baseConfig);
      break;
    case 'development':
      cachedConfig = developmentConfig(baseConfig);
      break;
    case 'staging':
      cachedConfig = stagingConfig(baseConfig);
      break;
    case 'local':
      cachedConfig = localConfig(baseConfig);
      break;
    default:
      throw new Error(`Invalid NODE_ENV value: ${process.env.NODE_ENV}`);
  }

  return cachedConfig;
};
