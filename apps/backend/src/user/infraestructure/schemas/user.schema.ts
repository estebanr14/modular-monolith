import { Schema, HydratedDocument } from 'mongoose';
import { IUser } from '../../domain/entities/user.interface';
import { UserStatusEnum } from '../../domain/value-objects.ts/user-status.value-object';

export type UserDocument = HydratedDocument<IUser>;

const VerificationCodeSchema = {
  code: { type: String },
  expirationDate: { type: Date },
};

const UserSchemaDefinition = {
  emailHash: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String },
  phoneNumber: { type: String },
  password: { type: String },
  pin: { type: String },
  status: {
    type: String,
    default: UserStatusEnum.PENDING,
    enum: UserStatusEnum,
  },
  name: { type: String },
  lastname: { type: String },
  lastLoginDate: { type: Date },
  lastLoginIp: { type: String },
  referralCode: { type: String },
  emailVerification: VerificationCodeSchema,
  forgotPasswordVerification: VerificationCodeSchema,
};

export const UserSchema = new Schema<IUser>(UserSchemaDefinition, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret): IUser => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret as IUser;
    },
  },
});
