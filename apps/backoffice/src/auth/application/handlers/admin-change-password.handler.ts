import { CommandHandler } from '@nestjs/cqrs';
import { BaseChangePasswordHandler } from '@app/shared';
import { AdminChangePasswordCommand } from '../commands/admin-change-password.command';
import { AdminService } from '../../../admin/application/admin.service';

@CommandHandler(AdminChangePasswordCommand)
export class AdminChangePasswordHandler extends BaseChangePasswordHandler {
  constructor(adminService: AdminService) {
    super(adminService);
  }
}
