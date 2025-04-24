import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAdminCommand } from '../commands/create-admin.command';
import { Admin } from '../../domain/entities/admin.entity';
import { AdminMapper } from '../mappers/admin.mapper';
import { AdminResponseDto } from '../../presentation/dtos/admin.response.dto';
import { AdminService } from '../admin.service';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { EmailValueObject } from '@app/shared/value-objects/email.value-object';

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
  constructor(private readonly adminService: AdminService) {}
  private readonly logger = new Logger(CreateAdminHandler.name);

  async execute(command: CreateAdminCommand): Promise<AdminResponseDto> {
    this.logger.log(`[handler]: CreateAdminCommand`);
    const emailHash = new EmailValueObject(command.adminData.email).toHashed();
    const passwordHash = await bcrypt.hash(command.adminData.password, 10);
    const adminEntity = new Admin({
      ...command.adminData,
      emailHash,
      password: passwordHash,
    });
    const createdAdmin = await this.adminService.createAdmin(adminEntity);
    return AdminMapper.toResponse(createdAdmin);
  }
}
