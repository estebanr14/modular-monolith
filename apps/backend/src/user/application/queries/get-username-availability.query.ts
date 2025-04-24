import { IQuery } from '@nestjs/cqrs';

export class GetUsernamesAvailabilityQuery implements IQuery {
  constructor(public readonly username: string) {}
}
