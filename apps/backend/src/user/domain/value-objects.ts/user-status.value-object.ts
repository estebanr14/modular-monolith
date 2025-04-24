import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { StringValueObject } from '../../../../../../libs/shared/src/value-objects/string.value-object';

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

export class UserStatus extends StringValueObject {
  constructor(status: string) {
    super(status);
    this.validateStatus(status);
  }
  override readonly logger = new Logger(UserStatus.name);

  private validateStatus(status: string) {
    if (!status) return;
    if (!Object.values(UserStatusEnum).includes(status as UserStatusEnum)) {
      this.logger.error(`Invalid user status. Status: ${status}`);
      throw new UnprocessableEntityException('Invalid user status.');
    }
  }
}
