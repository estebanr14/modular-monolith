import { IVerificationCode } from '@app/shared/value-objects/code-verification.value-object';

export interface IUser {
  id?: string;
  phoneNumber?: string;
  emailHash?: string;
  email?: string;
  password?: string;
  status?: string;
  username?: string;
  name?: string;
  lastname?: string;
  forgotPasswordVerification?: IVerificationCode;
  referralCode?: string;
  lastLoginDate?: Date;
  lastLoginIp?: string;
}
