import { Module } from '@nestjs/common';
import adminProviders from './application/providers/admin.providers';
import { AdminController } from './presentation/http/admin.controller';
import { CreateAdminHandler } from './application/handlers/create-admin.handler';
import { GetAdminHandler } from './application/handlers/get-admin.handler';
import { UpdateAdminHandler } from './application/handlers/update-admin.handler';
import { DeleteAdminHandler } from './application/handlers/delete-admin.handler';
import { GetAllAdminsHandler } from './application/handlers/get-all-admins.handler';
import { ActivateAdminHandler } from './application/handlers/activate-admin.handler';

const commandHandlers = [
  CreateAdminHandler,
  UpdateAdminHandler,
  DeleteAdminHandler,
  ActivateAdminHandler,
];
const queryHandlers = [GetAdminHandler, GetAllAdminsHandler];

@Module({
  providers: [...adminProviders, ...commandHandlers, ...queryHandlers],
  exports: [...adminProviders],
  controllers: [AdminController],
})
export class AdminsModule {}
