import { OmitType } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';

export class AdminResponseDto extends OmitType(AdminDto, [
  'password',
  'emailHash',
] as const) {}
