import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAdminQuery } from '../queries/get-admin.query';
import { AdminMapper } from '../mappers/admin.mapper';
import { AdminResponseDto } from '../../presentation/dtos/admin.response.dto';
import { AdminService } from '../admin.service';

@QueryHandler(GetAdminQuery)
export class GetAdminHandler implements IQueryHandler<GetAdminQuery> {
  constructor(private readonly adminService: AdminService) {}

  async execute(query: GetAdminQuery): Promise<AdminResponseDto> {
    const adminEntity = await this.adminService.findById(query.id);
    return AdminMapper.toResponse(adminEntity);
  }
}
