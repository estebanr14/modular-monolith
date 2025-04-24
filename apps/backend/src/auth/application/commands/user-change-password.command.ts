import { BaseChangePasswordCommand } from '@app/shared';
import { Role } from '@app/shared';

export class UserChangePasswordCommand extends BaseChangePasswordCommand {
  constructor(userId: string, oldPassword: string, newPassword: string) {
    super(userId, oldPassword, newPassword, Role.User);
  }
}
