import { Connection, Model } from 'mongoose';
import { MongoConstantsProvider } from '@app/database/mongo/mongo.constants';
import { AdminSchema } from '../../infraestructure/schemas/admin.schema';
import { FactoryProvider, Provider } from '@nestjs/common';
import { MongoAdminRepository } from '../../infraestructure/repositories/admin.mongo.repository';
import { AdminService } from '../admin.service';
import { IAdmin } from '../../domain/entities/admin.interface';
import { EmailService } from '@app/email';

const AdminDocumentProvider = {
  provide: MongoConstantsProvider.MongoAdminSchema,
  useFactory: (connection: Connection): Model<IAdmin> =>
    connection.model<IAdmin>('Admin', AdminSchema),
  inject: [MongoConstantsProvider.MongoConnection],
};

const MongoAdminRepositoryProvider: FactoryProvider<MongoAdminRepository> = {
  inject: [MongoConstantsProvider.MongoAdminSchema],
  provide: MongoConstantsProvider.MongoAdminRepository,
  useFactory: (adminModel) => new MongoAdminRepository(adminModel),
};

const AdminServiceProvider = {
  provide: AdminService,
  useFactory: (repository: MongoAdminRepository) =>
    new AdminService(repository),
  inject: [MongoConstantsProvider.MongoAdminRepository, EmailService],
};

const AdminProviders: Provider[] = [
  MongoAdminRepositoryProvider,
  AdminDocumentProvider,
  AdminServiceProvider,
];

export default AdminProviders;
