import { ICommand } from '@nestjs/cqrs';
import { UserEmailDto } from '../../presentation/dtos/user-email.dto';

export class UserForgotPasswordCommand implements ICommand {
  constructor(public readonly userData: UserEmailDto) {}
}
