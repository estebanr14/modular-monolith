import { Schema, HydratedDocument } from 'mongoose';
import { IAdmin } from '../../domain/entities/admin.interface';
import { AdminStatusEnum } from '../../domain/value-objects.ts/admin-status.value-object';

export type AdminDocument = HydratedDocument<IAdmin>;

const VerificationCodeSchema = {
  code: { type: String },
  expirationDate: { type: Date },
};

const AdminSchemaDefinition = {
  emailHash: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  password: { type: String },
  status: { type: String, default: AdminStatusEnum.ACTIVE },
  name: { type: String },
  lastname: { type: String },
  mfaValidation: VerificationCodeSchema,
  lastLoginDate: { type: Date },
  lastLoginIp: { type: String },
};

export const AdminSchema = new Schema<IAdmin>(AdminSchemaDefinition, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});
