export interface BaseConfig {
  environment: string;
  appPort: number;
  appName: 'backend' | 'backoffice';
  backofficePort: number;
  jwtSecret: string;
  jwtRefreshSecret: string;
  sendgridApiKey: string;
  emailFrom: string;
  mongo: {
    uri: string;
    dbName: string;
  };
  defaultTimeoutMs: number;
  encryptionKey: string;
  swaggerCredentials: {
    username: string;
    password: string;
  };
  rabbit: {
    host: string;
    port: string;
    user: string;
    pass: string;
  };
}
export interface Config extends BaseConfig {
  environment: 'local' | 'development' | 'staging' | 'production';
  appAdminUrl: string;
  swagger: {
    backoffice: {
      title: string;
      description: string;
      path: string;
      username: string;
      password: string;
    };
    backend: {
      title: string;
      description: string;
      path: string;
      username: string;
      password: string;
    };
  };
  auth: {
    jwtExpirationTime: string;
    jwtRefreshTime: string;
  };
  rabbit: {
    host: string;
    port: string;
    user: string;
    pass: string;
    connectionString: string;
    backend: {
      queue: string;
      exchange: string;
      routingKey: string;
      dlxQueue: string;
      dlxRoutingKey: string;
      dlx: string;
      failedQueue: string;
      failedRoutingKey: string;
    };
    backoffice: {
      queue: string;
      exchange: string;
      routingKey: string;
      dlxQueue: string;
      dlxRoutingKey: string;
      dlx: string;
      failedQueue: string;
      failedRoutingKey: string;
    };
  };
}
