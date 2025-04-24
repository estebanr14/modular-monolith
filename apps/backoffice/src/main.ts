import { NestFactory } from '@nestjs/core';
import { BackofficeModule } from './backoffice.module';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import configFactory from '@app/config/config.factory';
import {
  HttpExceptionFilter,
  LoggerInterceptor,
  TimeoutInterceptor,
  SwaggerConfig,
} from '@app/shared';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const environmentArg = process.argv.find((arg) =>
    arg.startsWith('--environment='),
  );
  if (!environmentArg) {
    throw new Error(
      'Environment argument not provided. Use --environment=<environment>',
    );
  }
  const environmentValue = environmentArg.split('=')[1];
  process.env.NODE_ENV = environmentValue;
  process.env.APP_NAME = 'backoffice';
  const app = await NestFactory.create(BackofficeModule);
  const logger: Logger = new Logger();
  const config = await configFactory();
  app.enableCors({
    origin: [config.appAdminUrl],
    credentials: true,
  });
  app.setGlobalPrefix('v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.useGlobalInterceptors(
    app.get(TimeoutInterceptor),
    app.get(LoggerInterceptor),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  SwaggerConfig.setup(app, {
    title: config.swagger.backoffice.title,
    description: config.swagger.backoffice.description,
    path: config.swagger.backoffice.path,
    username: config.swaggerCredentials.username,
    password: config.swaggerCredentials.password,
  });

  // RabbitMQ
  const { exchange, queue, routingKey, dlxRoutingKey, dlx } =
    config.rabbit.backoffice;
  const { connectionString } = config.rabbit;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [connectionString],
      queue: queue,
      exchange: exchange,
      routingKey: routingKey,
      noAck: false,
      queueOptions: {
        durable: true,
        deadLetterExchange: dlx,
        deadLetterRoutingKey: dlxRoutingKey,
      },
    },
  });

  await app.startAllMicroservices();

  const port = Number(config.backofficePort);
  await app.listen(port);
  logger.log(`Server listening on port: ${port}`);
}
bootstrap();
