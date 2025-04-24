import { IUser } from './user.interface';
import { UserStatus } from '../value-objects.ts/user-status.value-object';
import { CodeVerificationValueObject } from '../../../../../../libs/shared/src/value-objects/code-verification.value-object';
import { EmailValueObject } from '@app/shared/value-objects/email.value-object';
import { StringValueObject } from '@app/shared/value-objects/string.value-object';
import { PhoneNumberValueObject } from '@app/shared/value-objects/phone-number.value-object';

export class User {
  public readonly id: string;
  public readonly status: UserStatus;
  public readonly username: string;
  public readonly emailHash: StringValueObject;
  public readonly email: EmailValueObject;
  public readonly phoneNumber: PhoneNumberValueObject;
  public readonly password: StringValueObject;
  public readonly name: StringValueObject;
  public readonly lastname: StringValueObject;
  public forgotPasswordVerification?: CodeVerificationValueObject;
  public readonly referralCode?: string;
  public readonly lastLoginDate?: Date;
  public readonly lastLoginIp?: string;

  constructor(
    props: IUser,
    options: { fromDatabase?: boolean } = { fromDatabase: false },
  ) {
    this.id = props.id;
    this.status = new UserStatus(props.status);
    this.username = props.username;
    this.emailHash = new StringValueObject(props.emailHash);
    this.email = new EmailValueObject(props.email, {
      ...options,
      encrypt: true,
    });
    this.phoneNumber = new PhoneNumberValueObject(props.phoneNumber, {
      ...options,
      encrypt: true,
    });
    this.password = new StringValueObject(props.password, {
      ...options,
      encrypt: true,
    });
    this.name = new StringValueObject(props.name);
    this.lastname = new StringValueObject(props.lastname);
    this.forgotPasswordVerification = new CodeVerificationValueObject(
      props.forgotPasswordVerification?.code,
      props.forgotPasswordVerification?.expirationDate,
      options.fromDatabase,
    );
    this.referralCode = props.referralCode;
    this.lastLoginDate = props.lastLoginDate;
    this.lastLoginIp = props.lastLoginIp;
  }

  public static fromDatabase(props: IUser): User {
    return new User(props, { fromDatabase: true });
  }

  public toDatabase(): IUser {
    return {
      id: this.id,
      username: this.username,
      emailHash: this.emailHash.value,
      email: this.email?.encryptedValue,
      phoneNumber: this.phoneNumber?.encryptedValue,
      password: this.password?.encryptedValue,
      status: this.status.value,
      name: this.name.value,
      lastname: this.lastname.value,
      forgotPasswordVerification: this.forgotPasswordVerification?.value,
      referralCode: this.referralCode,
      lastLoginDate: this.lastLoginDate,
      lastLoginIp: this.lastLoginIp,
    };
  }

  public toPrimitives(): IUser {
    return {
      id: this.id,
      username: this.username,
      emailHash: this.emailHash.value,
      email: this.email.value,
      phoneNumber: this.phoneNumber.value,
      password: this.password.encryptedValue,
      status: this.status.value,
      name: this.name.value,
      lastname: this.lastname.value,
      forgotPasswordVerification: this.forgotPasswordVerification.value,
      referralCode: this.referralCode,
      lastLoginDate: this.lastLoginDate,
      lastLoginIp: this.lastLoginIp,
    };
  }

  set setForgotPasswordVerification(code: CodeVerificationValueObject) {
    this.forgotPasswordVerification = code;
  }
}
