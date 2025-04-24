import { IVerificationCode } from '@app/shared/value-objects/code-verification.value-object';

export interface IAdmin {
  id?: string;
  phoneNumber?: string;
  emailHash?: string;
  email?: string;
  password?: string;
  status?: string;
  name?: string;
  lastname?: string;
  mfaValidation?: IVerificationCode;
  lastLoginDate?: Date;
  lastLoginIp?: string;
}
