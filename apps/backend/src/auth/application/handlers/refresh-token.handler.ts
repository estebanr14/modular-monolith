import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseRefreshTokenHandler } from '@app/shared/auth/application/handlers/base-refresh-token.handler';
import { AuthService } from '@app/shared';
import { UserRefreshTokenCommand } from '../commands/user-refresh-token.command';

@CommandHandler(UserRefreshTokenCommand)
export class RefreshTokenHandler
  extends BaseRefreshTokenHandler
  implements ICommandHandler<UserRefreshTokenCommand>
{
  constructor(authService: AuthService) {
    super(authService);
  }
}
