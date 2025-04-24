import { BaseChangePasswordCommand } from '@app/shared/auth/application/commands/base-change-password.command';
import { Role } from '@app/shared';

export class AdminChangePasswordCommand extends BaseChangePasswordCommand {
  constructor(userId: string, oldPassword: string, newPassword: string) {
    super(userId, oldPassword, newPassword, Role.Admin);
  }
}
