import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../user.service';
import { UserForgotPasswordCommand } from '../../commands/user-forgot-password.command';

@CommandHandler(UserForgotPasswordCommand)
export class UserForgotPasswordHandler
  implements ICommandHandler<UserForgotPasswordCommand>
{
  constructor(private readonly userService: UserService) {}

  async execute(command: UserForgotPasswordCommand) {
    const { email } = command.userData;
    await this.userService.userForgotPassword(email);
  }
}
