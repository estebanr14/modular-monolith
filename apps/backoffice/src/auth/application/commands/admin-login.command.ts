import { BaseLoginCommand } from '@app/shared';
import { Role } from '@app/shared';

export class AdminLoginCommand extends BaseLoginCommand {
  constructor(email: string, password: string) {
    super(email, password, Role.Admin);
  }
}
