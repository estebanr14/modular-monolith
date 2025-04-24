import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/auth.controller';
import { SignupHandler } from './application/handlers/signup.handler';
import { UsersModule } from '../user/user.module';
import { RefreshTokenHandler } from './application/handlers/refresh-token.handler';
import { UserLoginHandler } from './application/handlers/user-login.handler';
import { AuthModule, SharedModule } from '@app/shared';
import { UserChangePasswordHandler } from './application/handlers/user-change-password.handler';

const commandHandlers = [
  SignupHandler,
  UserLoginHandler,
  RefreshTokenHandler,
  UserChangePasswordHandler,
];
const queryHandlers = [];

@Module({
  imports: [UsersModule, SharedModule, AuthModule],
  providers: [...commandHandlers, ...queryHandlers],
  exports: [],
  controllers: [AuthController],
})
export class UsersAuthModule {}
