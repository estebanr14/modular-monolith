import { IQuery } from '@nestjs/cqrs';
import { GetListUserFiltersDto } from '../../presentation/dtos/get-list-users.dto';
import { PaginationDto } from '@app/database';

export class GetListUserQuery implements IQuery {
  constructor(
    public readonly filters: GetListUserFiltersDto = {},
    public readonly pagination: PaginationDto = { page: 1, limit: 10 },
  ) {}
}
