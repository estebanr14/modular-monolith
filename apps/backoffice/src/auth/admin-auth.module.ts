import { Module } from '@nestjs/common';
import { AdminAuthController } from './presentation/http/admin-auth.controller';
import { RefreshTokenHandler } from './application/handlers/admin-refresh-token.handler';
import { AdminLoginHandler } from './application/handlers/admin-login.handler';
import { AdminsModule } from '../admin/admin.module';
import { AuthModule, SharedModule } from '@app/shared';
import { AdminChangePasswordHandler } from './application/handlers/admin-change-password.handler';
import { SendMfaCodeHandler } from './application/handlers/send-mfa-code.handler';
import { AdminValidateMFAHandler } from './application/handlers/admin-validate-mfa.handler';

const commandHandlers = [
  AdminLoginHandler,
  RefreshTokenHandler,
  AdminChangePasswordHandler,
  AdminValidateMFAHandler,
  SendMfaCodeHandler,
];
const queryHandlers = [];

@Module({
  imports: [AdminsModule, SharedModule, AuthModule],
  providers: [...commandHandlers, ...queryHandlers],
  exports: [],
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
