import { PartialType, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(
  PickType(UserDto, [
    'name',
    'lastname',
    'phoneNumber',
    'referralCode',
  ] as const),
) {}
