import { OmitType } from '@nestjs/swagger';
import { UserDto } from '../../../user/presentation/dtos/user.dto';

export class SignupDto extends OmitType(UserDto, [
  'id',
  'status',
  'emailHash',
  'lastLoginDate',
  'lastLoginIp',
] as const) {}
