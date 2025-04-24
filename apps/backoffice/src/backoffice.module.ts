import { Module } from '@nestjs/common';
import { BaseConfigModule } from '@app/config';
import { SharedModule } from '@app/shared';
import { DatabaseModule } from '../../../libs/database/src';
import { AdminsModule } from './admin/admin.module';
import { EmailModule } from '@app/email';
import { AdminAuthModule } from './auth/admin-auth.module';
import { RabbitMqModule } from '../../../libs/rabbit-mq/src';

@Module({
  imports: [
    BaseConfigModule,
    SharedModule,
    DatabaseModule,
    AdminsModule,
    EmailModule,
    AdminAuthModule,
    RabbitMqModule,
  ],
  controllers: [],
  providers: [],
})
export class BackofficeModule {}
