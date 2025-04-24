import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../../commands/update-user.command';
import { UserService } from '../../user.service';
import { Logger } from '@nestjs/common';
import { UserResponseDto } from '../../../presentation/dtos/user.response.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { User } from '../../../domain/entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UpdateUserHandler.name);

  async execute(command: UpdateUserCommand): Promise<UserResponseDto> {
    this.logger.log(`[handler]: UpdateUserHandler`);

    const userEntity = new User({ ...command.userData, id: command.id });
    const updatedUser = await this.userService.updateUser(userEntity);
    return UserMapper.toResponse(updatedUser);
  }
}
