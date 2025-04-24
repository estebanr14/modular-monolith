import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '@app/email';
import { Logger } from '@nestjs/common';
import { UserForgotPasswordCodeUpdatedEvent } from '../../events/user-forgot-password-code-updated.event';

@EventsHandler(UserForgotPasswordCodeUpdatedEvent)
export class UserForgotPasswordCodeUpdatedHandler
  implements IEventHandler<UserForgotPasswordCodeUpdatedEvent>
{
  constructor(private readonly emailService: EmailService) {}
  private readonly logger = new Logger(
    UserForgotPasswordCodeUpdatedHandler.name,
  );

  handle(event: UserForgotPasswordCodeUpdatedEvent) {
    this.logger.log(`[handler]: UserForgotPasswordCodeUpdatedHandler`);

    this.emailService.sendForgotPasswordEmail(event.email, event.code);
  }
}
