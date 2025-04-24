import { ICommand } from '@nestjs/cqrs';

export class ActivateAdminCommand implements ICommand {
  constructor(public readonly id: string) {}
}
