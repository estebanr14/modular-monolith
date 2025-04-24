import { ICommand } from '@nestjs/cqrs';

export class ValidateUserPinCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly pin: string,
  ) {}
}
