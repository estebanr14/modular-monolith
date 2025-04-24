import { BaseLoginCommand } from '@app/shared';
import { Role } from '@app/shared';

export class UserLoginCommand extends BaseLoginCommand {
  constructor(email: string, password: string) {
    super(email, password, Role.User);
  }
}
