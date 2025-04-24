import { IntersectionType, PartialType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { PaginationDto } from '@app/database';

export class GetListUserFiltersDto extends PartialType(UserDto) {}

export class GetListUserQueryDto extends IntersectionType(
  GetListUserFiltersDto,
  PaginationDto,
) {}
