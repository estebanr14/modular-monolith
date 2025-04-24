import { IAdmin } from './admin.interface';
import { StringValueObject } from '../../../../../../libs/shared/src/value-objects/string.value-object';
import { EmailValueObject } from '../../../../../../libs/shared/src/value-objects/email.value-object';
import { PhoneNumberValueObject } from '@app/shared/value-objects/phone-number.value-object';
import { AdminStatus } from '../value-objects.ts/admin-status.value-object';
import { CodeVerificationValueObject } from '@app/shared/value-objects/code-verification.value-object';

export class Admin {
  public readonly id: string;
  public readonly status?: AdminStatus;
  public readonly emailHash?: StringValueObject;
  public readonly email?: EmailValueObject;
  public readonly phoneNumber?: PhoneNumberValueObject;
  public readonly password?: StringValueObject;
  public readonly name?: StringValueObject;
  public readonly lastname?: StringValueObject;
  public mfaValidation?: CodeVerificationValueObject;
  public readonly lastLoginDate?: Date;
  public readonly lastLoginIp?: string;

  constructor(
    props: IAdmin,
    options: { fromDatabase?: boolean } = { fromDatabase: false },
  ) {
    this.id = props.id;
    this.status = new AdminStatus(props.status);
    this.emailHash = props.emailHash && new StringValueObject(props.emailHash);
    this.email =
      props.email &&
      new EmailValueObject(props.email, {
        ...options,
        encrypt: true,
      });
    this.phoneNumber =
      props.phoneNumber &&
      new PhoneNumberValueObject(props.phoneNumber, {
        ...options,
        encrypt: true,
      });
    this.password =
      props.password &&
      new StringValueObject(props.password, {
        ...options,
        encrypt: true,
      });
    this.name = props.name && new StringValueObject(props.name);
    this.lastname = props.lastname && new StringValueObject(props.lastname);
    this.lastLoginDate = props.lastLoginDate;
    this.mfaValidation = new CodeVerificationValueObject(
      props.mfaValidation?.code,
      props.mfaValidation?.expirationDate,
      options.fromDatabase,
    );
    this.lastLoginIp = props.lastLoginIp;
  }

  public static fromDatabase(props: IAdmin): Admin {
    return new Admin(props, { fromDatabase: true });
  }

  public toDatabase(): IAdmin {
    return {
      id: this.id,
      emailHash: this.emailHash?.value,
      email: this.email?.encryptedValue,
      phoneNumber: this.phoneNumber?.encryptedValue,
      password: this.password?.encryptedValue,
      status: this.status?.value,
      name: this.name?.value,
      lastname: this.lastname?.value,
      mfaValidation: this.mfaValidation?.value,
      lastLoginDate: this.lastLoginDate,
      lastLoginIp: this.lastLoginIp,
    };
  }

  public toPrimitives(): IAdmin {
    return {
      id: this.id,
      emailHash: this.emailHash.value,
      email: this.email.value,
      phoneNumber: this.phoneNumber.value,
      password: this.password.encryptedValue,
      status: this.status.value,
      name: this.name.value,
      lastname: this.lastname.value,
      mfaValidation: this.mfaValidation.value,
      lastLoginDate: this.lastLoginDate,
      lastLoginIp: this.lastLoginIp,
    };
  }

  set setMFAValidation(code: CodeVerificationValueObject) {
    this.mfaValidation = code;
  }
}
