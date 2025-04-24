import { CommandHandler } from '@nestjs/cqrs';
import { AdminValidateMFACommand } from '../commands/admin-validate-mfa.command';
import { AdminService } from 'apps/backoffice/src/admin/application/admin.service';
import { AuthService, Role } from '@app/shared';

@CommandHandler(AdminValidateMFACommand)
export class AdminValidateMFAHandler {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: AdminValidateMFACommand) {
    const validatedAdmin = await this.adminService.validateMFA(
      command.email,
      command.code,
    );

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      {
        sub: validatedAdmin.id,
        role: Role.Admin,
        username: validatedAdmin.email.toString(),
      },
    );

    return { refreshToken, accessToken, sub: validatedAdmin.id };
  }
}
