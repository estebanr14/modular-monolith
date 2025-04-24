import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../../queries/get-user.query';
import { UserMapper } from '../../mappers/user.mapper';
import { UserResponseDto } from '../../../presentation/dtos/user.response.dto';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../../user.service';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserQuery): Promise<UserResponseDto> {
    const userEntity = await this.userService.findById(query.id);
    if (!userEntity) {
      throw new NotFoundException(`User with id ${query.id} not found`);
    }
    return UserMapper.toResponse(userEntity);
  }
}
