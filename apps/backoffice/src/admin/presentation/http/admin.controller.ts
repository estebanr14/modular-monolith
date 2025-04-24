import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  InternalServerErrorException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NestCqrsCaller } from '@app/shared/cqrs/nest-cqrs-caller.service';
import {
  ApiTags,
  ApiAcceptedResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AdminResponseDto } from '../dtos/admin.response.dto';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { CreateAdminCommand } from '../../application/commands/create-admin.command';
import { Throttle } from '@nestjs/throttler';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { UpdateAdminCommand } from '../../application/commands/update-admin.command';
import { GetAdminQuery } from '../../application/queries/get-admin.query';
import { DeleteAdminCommand } from '../../application/commands/delete-admin.command';
import {
  JwtAuthGuard,
  Role,
  Roles,
  RolesGuard,
} from '../../../../../../libs/shared/src';
import { GetAllAdminsQuery } from '../../application/queries/get-all-admins.query';
import { ActivateAdminCommand } from '../../application/commands/activate-admin.command';

@ApiTags('Admins')
@Controller('admins')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly cqrsCaller: NestCqrsCaller) {}

  @Post()
  @Roles(Role.Admin)
  @Throttle({ default: { limit: 6, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiAcceptedResponse({ type: AdminResponseDto })
  @ApiBody({ type: CreateAdminDto })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminResponseDto> {
    const command = new CreateAdminCommand(createAdminDto);
    const admin = await this.cqrsCaller.dispatch(command);
    if (!admin || !(admin instanceof AdminResponseDto))
      throw new InternalServerErrorException('Error creating admin');
    return admin;
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update an existing admin' })
  @ApiAcceptedResponse({ type: AdminResponseDto })
  @ApiParam({
    name: 'id',
    description: 'Admin Id',
    example: '60d21b4667d0d8992e610c85',
  })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    const command = new UpdateAdminCommand(id, updateAdminDto);
    const admin = await this.cqrsCaller.dispatch(command);
    if (!admin || !(admin instanceof AdminResponseDto))
      throw new InternalServerErrorException('Error creating admin');
    return admin;
  }

  @Get(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve an admin by ID' })
  @ApiAcceptedResponse({ type: AdminResponseDto })
  @ApiParam({
    name: 'id',
    description: 'Admin Id',
    example: '60d21b4667d0d8992e610c85',
  })
  async getAdmin(@Param('id') id: string): Promise<AdminResponseDto> {
    const query = new GetAdminQuery(id);
    const admin = await this.cqrsCaller.query(query);
    if (!admin || !(admin instanceof AdminResponseDto))
      throw new InternalServerErrorException('Error creating admin');
    return admin;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete an admin by ID (Set to inactive)' })
  @ApiAcceptedResponse({ type: AdminResponseDto })
  @ApiParam({
    name: 'id',
    description: 'Admin Id',
    example: '60d21b4667d0d8992e610c85',
  })
  async deleteAdmin(@Param('id') id: string): Promise<AdminResponseDto> {
    const command = new DeleteAdminCommand(id);
    const admin = await this.cqrsCaller.dispatch(command);
    if (!admin || !(admin instanceof AdminResponseDto))
      throw new InternalServerErrorException('Error deleting admin');
    return admin;
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve all admins' })
  @ApiAcceptedResponse({ type: [AdminResponseDto] })
  async getAllAdmins(): Promise<AdminResponseDto[]> {
    const query = new GetAllAdminsQuery();
    const admins = await this.cqrsCaller.query(query);
    if (!admins || !Array.isArray(admins))
      throw new InternalServerErrorException('Error retrieving admins');
    return admins;
  }

  @Post(':id/activate')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Activate an admin by ID' })
  @ApiAcceptedResponse({ type: AdminResponseDto })
  @ApiParam({
    name: 'id',
    description: 'Admin Id',
    example: '60d21b4667d0d8992e610c85',
  })
  async activateAdmin(@Param('id') id: string): Promise<AdminResponseDto> {
    const command = new ActivateAdminCommand(id);
    const admin = await this.cqrsCaller.dispatch(command);
    if (!admin || !(admin instanceof AdminResponseDto))
      throw new InternalServerErrorException('Error activating admin');
    return admin;
  }
}
