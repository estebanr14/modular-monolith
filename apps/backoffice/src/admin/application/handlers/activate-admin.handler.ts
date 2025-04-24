import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminMapper } from '../mappers/admin.mapper';
import { AdminResponseDto } from '../../presentation/dtos/admin.response.dto';
import { AdminService } from '../admin.service';
import { Logger } from '@nestjs/common';
import { ActivateAdminCommand } from '../commands/activate-admin.command';

@CommandHandler(ActivateAdminCommand)
export class ActivateAdminHandler
  implements ICommandHandler<ActivateAdminCommand>
{
  constructor(private readonly adminService: AdminService) {}
  private readonly logger = new Logger(ActivateAdminHandler.name);

  async execute(command: ActivateAdminCommand): Promise<AdminResponseDto> {
    this.logger.log(`[handler]: ActivateAdminCommand`);
    const activatedAdmin = await this.adminService.setActive(command.id);
    return AdminMapper.toResponse(activatedAdmin);
  }
}
