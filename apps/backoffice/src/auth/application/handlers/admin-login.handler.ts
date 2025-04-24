import * as bcrypt from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminService } from '../../../admin/application/admin.service';
import { AdminLoginCommand } from '../commands/admin-login.command';
import { UnauthorizedException } from '@nestjs/common';
import { EmailValueObject } from '@app/shared/value-objects/email.value-object';
import { SendMfaCodeEvent } from '../events/send-mfa-code.event';
import { CodeVerificationValueObject } from '@app/shared/value-objects/code-verification.value-object';
import { NestCqrsCaller } from '@app/shared';

@CommandHandler(AdminLoginCommand)
export class AdminLoginHandler implements ICommandHandler<AdminLoginCommand> {
  constructor(
    private readonly adminService: AdminService,
    private readonly cqrsCaller: NestCqrsCaller,
  ) {}

  async execute(command: AdminLoginCommand) {
    const emailHash = new EmailValueObject(command.email).toHashed();
    const admin = await this.adminService.findByEmailHash(emailHash);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      command.password,
      admin.password.value,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const mfaCode = CodeVerificationValueObject.generateCode();
    admin.mfaValidation = mfaCode.codeVerificationValueObject;

    await this.adminService.updateAdmin(admin);

    this.cqrsCaller.emit(
      new SendMfaCodeEvent(admin.email.toString(), mfaCode.code),
    );
  }
}
