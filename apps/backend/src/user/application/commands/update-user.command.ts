import { ICommand } from '@nestjs/cqrs';
import { UpdateUserDto } from '../../presentation/dtos/update-user.dto';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly userData: UpdateUserDto,
  ) {}
}
