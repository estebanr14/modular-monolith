import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { PaginatedResult, PaginatedParams } from '@app/database';
import { GetListUserQuery } from '../../queries/get-list-user.query';
import { UserService } from '../../user.service';
import { UserResponseDto } from '../../../presentation/dtos/user.response.dto';
import { UserMapper } from '../../mappers/user.mapper';

@QueryHandler(GetListUserQuery)
export class GetListUserHandler implements IQueryHandler<GetListUserQuery> {
  private readonly logger = new Logger(GetListUserHandler.name);

  constructor(private readonly userService: UserService) {}

  async execute(
    query: GetListUserQuery,
  ): Promise<PaginatedResult<UserResponseDto>> {
    this.logger.log(`[handler]: Executing query for User`);

    const sortField = query.pagination.sortField || 'createdAt';
    const sortOrder =
      query.pagination.sortOrder?.toUpperCase() === 'ASC' ? 1 : -1;

    const params = new PaginatedParams(
      query.pagination.page || 1,
      query.pagination.limit || 10,
      { [sortField]: sortOrder },
      query.filters,
    );

    const paginatedResult = await this.userService.findAll(params);

    return {
      ...paginatedResult,
      results: paginatedResult.results.map((entity) =>
        UserMapper.toResponse(entity),
      ),
    };
  }
}
