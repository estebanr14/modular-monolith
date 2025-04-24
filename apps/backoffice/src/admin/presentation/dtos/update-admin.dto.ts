import { PartialType, PickType } from '@nestjs/swagger';
import { AdminDto } from './admin.dto';

export class UpdateAdminDto extends PartialType(
  PickType(AdminDto, ['name', 'lastname', 'email', 'phoneNumber'] as const),
) {}
