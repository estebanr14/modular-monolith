import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailClient } from './email.client';

@Global()
@Module({
  providers: [EmailService, EmailClient],
  exports: [EmailService],
})
export class EmailModule {}
