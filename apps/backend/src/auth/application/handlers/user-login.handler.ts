import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseLoginHandler } from '@app/shared/auth/application/handlers/base-login.handler';
import { AuthService } from '@app/shared';
import { UserService } from '../../../user/application/user.service';
import { UserLoginCommand } from '../commands/user-login.command';

@CommandHandler(UserLoginCommand)
export class UserLoginHandler
  extends BaseLoginHandler
  implements ICommandHandler<UserLoginCommand>
{
  constructor(userService: UserService, authService: AuthService) {
    super(userService, authService);
  }
}
