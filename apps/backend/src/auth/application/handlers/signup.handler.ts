import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../../user/domain/entities/user.entity';
import { UserService } from '../../../user/application/user.service';
import { AuthResponseDto } from '@app/shared';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { SignupCommand } from '../commands/sign-up.command';
import { EmailValueObject } from '../../../../../../libs/shared/src/value-objects/email.value-object';
import { AuthService } from '@app/shared';
import { Role } from '@app/shared';

@CommandHandler(SignupCommand)
export class SignupHandler implements ICommandHandler<SignupCommand> {
  private readonly logger = new Logger(SignupHandler.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: SignupCommand): Promise<AuthResponseDto> {
    this.logger.log(`[handler]: SignupCommand`);

    const emailHash = new EmailValueObject(command.data.email).toHashed();
    const passwordHash = await bcrypt.hash(command.data.password, 10);

    const userEntity = new User({
      ...command.data,
      emailHash,
      password: passwordHash,
    });

    const createdUser = await this.userService.createUser(userEntity);
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      {
        sub: createdUser.id,
        role: Role.User,
        username: createdUser.username,
      },
    );
    const response = {
      accessToken,
      refreshToken,
      sub: createdUser.id,
    };
    return response;
  }
}
