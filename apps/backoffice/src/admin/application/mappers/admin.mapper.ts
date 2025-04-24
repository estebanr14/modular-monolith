import { plainToInstance } from 'class-transformer';
import { Admin } from '../../domain/entities/admin.entity';
import { AdminResponseDto } from '../../presentation/dtos/admin.response.dto';

export class AdminMapper {
  static toResponse(admin: Admin): AdminResponseDto {
    const primitives = admin.toPrimitives();
    const response = plainToInstance(AdminResponseDto, primitives);
    return response;
  }
}
