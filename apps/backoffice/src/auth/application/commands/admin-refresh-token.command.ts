import { BaseRefreshTokenCommand } from '@app/shared';
import { Role } from '@app/shared';

export class AdminRefreshTokenCommand extends BaseRefreshTokenCommand {
  constructor(public readonly refreshToken: string) {
    super(refreshToken, Role.Admin);
  }
}
