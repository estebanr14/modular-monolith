import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@app/database/mongo/base.mongo.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoConstantsProvider } from '@app/database/mongo/mongo.constants';
import { AdminDocument } from '../schemas/admin.schema';
import { AdminStatusEnum } from '../../domain/value-objects.ts/admin-status.value-object';
import { IAdmin } from '../../domain/entities/admin.interface';

@Injectable()
export class MongoAdminRepository extends BaseMongoRepository<
  AdminDocument,
  IAdmin
> {
  constructor(
    @InjectModel(MongoConstantsProvider.MongoAdminSchema)
    private readonly adminModel: Model<AdminDocument>,
  ) {
    super(adminModel, 'Admin');
  }

  async findByEmailHash(emailHash: string): Promise<IAdmin | null> {
    return this.findOne({ emailHash: emailHash });
  }

  async setInactive(id: string): Promise<IAdmin | null> {
    return this.update(
      { id },
      {
        status: AdminStatusEnum.INACTIVE,
      },
    );
  }

  async setActive(id: string): Promise<IAdmin | null> {
    return this.update(
      { id },
      {
        status: AdminStatusEnum.ACTIVE,
      },
    );
  }

  async findAll(): Promise<IAdmin[]> {
    return this.adminModel.find({}).exec();
  }
}
