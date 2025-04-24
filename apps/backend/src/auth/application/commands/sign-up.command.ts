import { SignupDto } from '../../presentation/dtos/sign-up.dto';

export class SignupCommand {
  constructor(public readonly data: SignupDto) {}
}
