import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseRefreshTokenHandler } from '@app/shared/auth/application/handlers/base-refresh-token.handler';
import { AuthService } from '@app/shared';
import { AdminRefreshTokenCommand } from '../commands/admin-refresh-token.command';

@CommandHandler(AdminRefreshTokenCommand)
export class RefreshTokenHandler
  extends BaseRefreshTokenHandler
  implements ICommandHandler<AdminRefreshTokenCommand>
{
  constructor(authService: AuthService) {
    super(authService);
  }
}
