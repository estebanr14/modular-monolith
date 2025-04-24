import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@app/database/mongo/base.mongo.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoConstantsProvider } from '@app/database/mongo/mongo.constants';
import { UserDocument } from '../schemas/user.schema';
import { IUser } from '../../domain/entities/user.interface';

@Injectable()
export class MongoUserRepository extends BaseMongoRepository<
  UserDocument,
  IUser
> {
  constructor(
    @InjectModel(MongoConstantsProvider.MongoUserSchema)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel, 'User');
  }

  async findByEmailHash(emailHash: string): Promise<IUser | null> {
    return await this.findOne({ emailHash });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await this.findOne({ username });
  }
}
