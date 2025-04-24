import { ICommand } from '@nestjs/cqrs';
import { UpdateAdminDto } from '../../presentation/dtos/update-admin.dto';

export class UpdateAdminCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly adminData: UpdateAdminDto,
  ) {}
}
