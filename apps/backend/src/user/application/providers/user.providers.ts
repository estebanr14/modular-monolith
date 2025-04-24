import { Connection, Model } from 'mongoose';
import { MongoConstantsProvider } from '@app/database/mongo/mongo.constants';
import { UserSchema } from '../../infraestructure/schemas/user.schema';
import { FactoryProvider, Provider } from '@nestjs/common';
import { MongoUserRepository } from '../../infraestructure/repositories/user.mongo.repository';
import { UserService } from '../user.service';
import { NestCqrsCaller } from '@app/shared';
import { IUser } from '../../domain/entities/user.interface';

const UserDocumentProvider = {
  provide: MongoConstantsProvider.MongoUserSchema,
  useFactory: (connection: Connection): Model<IUser> =>
    connection.model<IUser>('User', UserSchema),
  inject: [MongoConstantsProvider.MongoConnection],
};

const MongoUserRepositoryProvider: FactoryProvider<MongoUserRepository> = {
  inject: [MongoConstantsProvider.MongoUserSchema],
  provide: MongoConstantsProvider.MongoUserRepository,
  useFactory: (userModel) => new MongoUserRepository(userModel),
};

const UserServiceProvider = {
  provide: UserService,
  useFactory: (repository: MongoUserRepository, cqrsCaller: NestCqrsCaller) =>
    new UserService(repository, cqrsCaller),
  inject: [MongoConstantsProvider.MongoUserRepository, NestCqrsCaller],
};

const UserProviders: Provider[] = [
  MongoUserRepositoryProvider,
  UserDocumentProvider,
  UserServiceProvider,
];

export default UserProviders;
