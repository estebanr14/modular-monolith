import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminMapper } from '../mappers/admin.mapper';
import { AdminResponseDto } from '../../presentation/dtos/admin.response.dto';
import { AdminService } from '../admin.service';
import { Logger } from '@nestjs/common';
import { DeleteAdminCommand } from '../commands/delete-admin.command';

@CommandHandler(DeleteAdminCommand)
export class DeleteAdminHandler implements ICommandHandler<DeleteAdminCommand> {
  constructor(private readonly adminService: AdminService) {}
  private readonly logger = new Logger(DeleteAdminHandler.name);

  async execute(command: DeleteAdminCommand): Promise<AdminResponseDto> {
    this.logger.log(`[handler]: DeleteAdminCommand`);

    const createdAdmin = await this.adminService.setInactive(command.id);
    return AdminMapper.toResponse(createdAdmin);
  }
}
