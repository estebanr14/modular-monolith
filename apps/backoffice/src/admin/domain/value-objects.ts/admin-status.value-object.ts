import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { StringValueObject } from '../../../../../../libs/shared/src/value-objects/string.value-object';

export enum AdminStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class AdminStatus extends StringValueObject {
  constructor(status: string = AdminStatusEnum.ACTIVE) {
    super(status);
    this.validateStatus(status);
  }
  override readonly logger = new Logger(AdminStatus.name);

  private validateStatus(status: string) {
    if (!Object.values(AdminStatusEnum).includes(status as AdminStatusEnum)) {
      this.logger.error(`Invalid user status. Status: ${status}`);
      throw new UnprocessableEntityException('Invalid user status.');
    }
  }
}
