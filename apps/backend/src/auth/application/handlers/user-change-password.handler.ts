import { CommandHandler } from '@nestjs/cqrs';
import { BaseChangePasswordHandler } from '@app/shared';
import { UserChangePasswordCommand } from '../commands/user-change-password.command';
import { UserService } from '../../../user/application/user.service';

@CommandHandler(UserChangePasswordCommand)
export class UserChangePasswordHandler extends BaseChangePasswordHandler {
  constructor(userService: UserService) {
    super(userService);
  }
}
