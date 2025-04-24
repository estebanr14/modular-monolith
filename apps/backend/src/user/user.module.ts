import { Module } from '@nestjs/common';
import userProviders from './application/providers/user.providers';
import { UserController } from './presentation/http/user.controller';
import { GetUserHandler } from './application/handlers/query-handlers/get-user.handler';
import { UpdateUserHandler } from './application/handlers/command-handlers/update-user.handler';
import { DeleteUserHandler } from './application/handlers/command-handlers/delete-user.handler';
import { UserForgotPasswordCodeUpdatedHandler } from './application/handlers/command-handlers/user-forgot-password-code-updated.handler';
import { UserForgotPasswordHandler } from './application/handlers/command-handlers/user-forgot-password.handler';
import { UserAlreadyRegisteredReminderHandler } from './application/handlers/command-handlers/user-already-registered-reminder.handler';
import { GetListUserHandler } from './application/handlers/query-handlers/get-list-user.handler';

const commandHandlers = [
  UpdateUserHandler,
  DeleteUserHandler,
  UserForgotPasswordHandler,
  UserForgotPasswordCodeUpdatedHandler,
  UserAlreadyRegisteredReminderHandler,
  GetListUserHandler,
];
const queryHandlers = [GetUserHandler];
const eventHandlers = [];

@Module({
  providers: [
    ...userProviders,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
  exports: [...userProviders],
  controllers: [UserController],
})
export class UsersModule {}
