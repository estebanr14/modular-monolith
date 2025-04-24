import { ICommand } from '@nestjs/cqrs';
import { CreateAdminDto } from '../../presentation/dtos/create-admin.dto';

export class CreateAdminCommand implements ICommand {
  constructor(public readonly adminData: CreateAdminDto) {}
}
