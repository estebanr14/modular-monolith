import { ICommand } from '@nestjs/cqrs';

export class SetUserPinCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly pin: string,
  ) {}
}
