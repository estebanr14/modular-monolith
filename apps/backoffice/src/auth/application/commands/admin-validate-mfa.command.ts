import { ICommand } from '@nestjs/cqrs';

export class AdminValidateMFACommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
