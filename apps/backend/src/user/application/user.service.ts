import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MongoUserRepository } from '../infraestructure/repositories/user.mongo.repository';
import { User } from '../domain/entities/user.entity';
import { IUserService, NestCqrsCaller } from '@app/shared';
import { UserStatusEnum } from '../domain/value-objects.ts/user-status.value-object';
import { EmailValueObject } from '@app/shared/value-objects/email.value-object';
import { UserForgotPasswordCodeUpdatedEvent } from './events/user-forgot-password-code-updated.event';
import { PaginatedParams, PaginatedResult } from '@app/database';
import { CodeVerificationValueObject } from '@app/shared/value-objects/code-verification.value-object';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: MongoUserRepository,
    private readonly cqrsCaller: NestCqrsCaller,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async createUser(user: User): Promise<User> {
    this.logger.log(`[createUser]: INIT`);

    const existingUser = await this.findByEmailHash(user.emailHash.value);

    if (existingUser) {
      this.logger.error(`[createUser]: ERROR: user already exists`);
      throw new BadRequestException('user already exists');
    }

    const savedUser = await this.userRepository.create(user.toDatabase());
    this.logger.log(`[createUser]: user created ${savedUser.id}`);
    return User.fromDatabase(savedUser);
  }

  async updateUser(user: User): Promise<User> {
    this.logger.log(`[updateUser]: INIT`);

    const existingUser = await this.findById(user.id);

    if (!existingUser) {
      this.logger.error(`[createUser]: ERROR: user not found`);
      throw new BadRequestException('user not found');
    }

    const savedUser = await this.userRepository.update(
      { id: user.id },
      {
        ...user.toDatabase(),
        referralCode: existingUser.referralCode || user.referralCode, // If the user already has a referral code, it should not be updated
      },
    );
    this.logger.log(`[updateUser]: user updated ${savedUser.id}`);
    return User.fromDatabase(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const userDocument = await this.userRepository.findById(id);
    return userDocument ? User.fromDatabase(userDocument) : null;
  }

  async findByEmailHash(emailHash: string): Promise<User | null> {
    const userDocument = await this.userRepository.findByEmailHash(emailHash);
    return userDocument ? User.fromDatabase(userDocument) : null;
  }

  async findAll(params: PaginatedParams): Promise<PaginatedResult<User>> {
    const paginatedResult = await this.userRepository.paginatedSearch(params);

    return {
      ...paginatedResult,
      results: paginatedResult.results.map((doc) => User.fromDatabase(doc)),
    };
  }

  async deleteUser(id: string): Promise<User> {
    this.logger.log(`[deleteUser]: INIT`);

    const existingUser = await this.findById(id);
    if (!existingUser) {
      this.logger.error(`[deleteUser]: ERROR: user not found`);
      throw new BadRequestException('user not found');
    }
    const deletedUserDoc = await this.userRepository.update(
      { id },
      { status: UserStatusEnum.INACTIVE },
    );

    this.logger.log(
      `[deleteUser]: user logically deleted ${deletedUserDoc.id}`,
    );
    return User.fromDatabase(deletedUserDoc);
  }

  async changePassword(id: string, newPasswordHash: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    const userEntity = new User({
      ...user.toPrimitives(),
      password: newPasswordHash,
    });
    await this.userRepository.update(
      { id },
      { password: userEntity.password.encryptedValue },
    );
  }

  async findByUsername(username: string): Promise<User | null> {
    const userDocument = await this.userRepository.findByUsername(username);
    return userDocument ? User.fromDatabase(userDocument) : null;
  }

  async isUsernameAvailable(username): Promise<boolean> {
    const user = await this.findByUsername(username);
    return !user;
  }

  async userForgotPassword(email: string): Promise<void> {
    this.logger.log(`[userForgotPassword]: INIT`);
    const user = await this.findByEmailHash(
      new EmailValueObject(email).toHashed(),
    );
    if (!user) {
      this.logger.error(`[userForgotPassword]: ERROR: user not found`);
      return;
    }

    if (user.status.value !== UserStatusEnum.ACTIVE) {
      this.logger.error(`[userForgotPassword]: ERROR: user not active`);
      return;
    }

    const forgotPasswordCode = CodeVerificationValueObject.generateCode();
    user.setForgotPasswordVerification =
      forgotPasswordCode.codeVerificationValueObject;

    await this.userRepository.update({ id: user.id }, user.toDatabase());
    this.logger.log(
      `[userForgotPassword]: forgot password code updated for user ${user.id}`,
    );

    this.cqrsCaller.emit(
      new UserForgotPasswordCodeUpdatedEvent(
        user.email.toString(),
        forgotPasswordCode.code,
      ),
    );
  }
}
