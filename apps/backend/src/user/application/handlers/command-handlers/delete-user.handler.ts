import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../../commands/delete-user.command';
import { UserService } from '../../user.service';
import { UserMapper } from '../../mappers/user.mapper';
import { UserResponseDto } from '../../../presentation/dtos/user.response.dto';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: DeleteUserCommand): Promise<UserResponseDto> {
    const deletedUser = await this.userService.deleteUser(command.id);
    return UserMapper.toResponse(deletedUser);
  }
}
