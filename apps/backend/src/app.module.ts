import { Module } from '@nestjs/common';

import { BaseConfigModule } from '@app/config';
import { AuthModule, SharedModule } from '@app/shared';
import { DatabaseModule } from '../../../libs/database/src';
import { UsersModule } from './user/user.module';
import { EmailModule } from '@app/email';
import { UsersAuthModule } from './auth/user.auth.module';
import { RabbitMqModule } from '../../../libs/rabbit-mq/src';

@Module({
  imports: [
    BaseConfigModule,
    SharedModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    EmailModule,
    UsersAuthModule,
    RabbitMqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
