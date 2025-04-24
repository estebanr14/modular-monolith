import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllAdminsQuery } from '../queries/get-all-admins.query';
import { AdminMapper } from '../mappers/admin.mapper';
import { AdminResponseDto } from '../../presentation/dtos/admin.response.dto';
import { AdminService } from '../admin.service';

@QueryHandler(GetAllAdminsQuery)
export class GetAllAdminsHandler implements IQueryHandler<GetAllAdminsQuery> {
  constructor(private readonly adminService: AdminService) {}

  async execute(): Promise<AdminResponseDto[]> {
    const adminEntities = await this.adminService.findAll();
    return adminEntities.map((admin) => AdminMapper.toResponse(admin));
  }
}
