import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SendMfaCodeEvent } from '../events/send-mfa-code.event';
import { Logger } from '@nestjs/common';
import { EmailService } from '@app/email';

@EventsHandler(SendMfaCodeEvent)
export class SendMfaCodeHandler implements IEventHandler<SendMfaCodeEvent> {
  constructor(private readonly emailService: EmailService) {}
  private readonly logger = new Logger(SendMfaCodeEvent.name);

  handle(event: SendMfaCodeEvent) {
    this.logger.log(`[handler]: SendMfaCodeHandler`);

    this.emailService.sendMFAEmail(event.email, event.code);
  }
}
