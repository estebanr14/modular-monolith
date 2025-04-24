import { plainToInstance } from 'class-transformer';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../../presentation/dtos/user.response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    const primitives = user.toPrimitives();
    delete primitives.password;
    delete primitives.forgotPasswordVerification;
    delete primitives.emailHash;
    const response = plainToInstance(UserResponseDto, primitives);
    return response;
  }
}
