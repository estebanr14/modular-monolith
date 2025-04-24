import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Admin } from '../../domain/entities/admin.entity';
import { AdminMapper } from '../mappers/admin.mapper';
import { AdminResponseDto } from '../../presentation/dtos/admin.response.dto';
import { AdminService } from '../admin.service';
import { Logger } from '@nestjs/common';
import { UpdateAdminCommand } from '../commands/update-admin.command';
import { IAdmin } from '../../domain/entities/admin.interface';
import { EmailValueObject } from '@app/shared/value-objects/email.value-object';

@CommandHandler(UpdateAdminCommand)
export class UpdateAdminHandler implements ICommandHandler<UpdateAdminCommand> {
  constructor(private readonly adminService: AdminService) {}
  private readonly logger = new Logger(UpdateAdminHandler.name);

  async execute(command: UpdateAdminCommand): Promise<AdminResponseDto> {
    this.logger.log(`[handler]: UpdateAdminCommand`);
    const updatedData: IAdmin = { ...command.adminData, id: command.id };
    if (command.adminData.email) {
      const emailHash = new EmailValueObject(
        command.adminData.email,
      ).toHashed();
      updatedData.emailHash = emailHash;
      this.logger.log(`[handler]: UpdateAdminCommand ${emailHash}`);
    }
    const updateAdminEntity = new Admin(updatedData);
    const createdAdmin = await this.adminService.updateAdmin(updateAdminEntity);
    return AdminMapper.toResponse(createdAdmin);
  }
}
