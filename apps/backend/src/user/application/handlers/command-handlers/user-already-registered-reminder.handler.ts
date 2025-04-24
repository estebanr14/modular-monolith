import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '@app/email';
import { Logger } from '@nestjs/common';
import { UserAlreadyRegisteredReminderEvent } from '../../events/user-already-registered-reminder.event';

@EventsHandler(UserAlreadyRegisteredReminderEvent)
export class UserAlreadyRegisteredReminderHandler
  implements IEventHandler<UserAlreadyRegisteredReminderEvent>
{
  constructor(private readonly emailService: EmailService) {}
  private readonly logger = new Logger(
    UserAlreadyRegisteredReminderHandler.name,
  );

  handle(event: UserAlreadyRegisteredReminderEvent) {
    this.logger.log(`[handler]: UserAlreadyRegisteredReminderHandler`);

    this.emailService.sendUserRegisteredReminderEmail(event.email);
  }
}
