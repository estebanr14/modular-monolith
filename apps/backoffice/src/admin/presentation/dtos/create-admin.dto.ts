import { OmitType } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';

export class CreateAdminDto extends OmitType(AdminDto, [
  'id',
  'lastLoginDate',
  'lastLoginIp',
  'status',
  'emailHash',
] as const) {}
