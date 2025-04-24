import {
  Controller,
  Get,
  Put,
  Body,
  InternalServerErrorException,
  UseGuards,
  Delete,
  Post,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { NestCqrsCaller } from '@app/shared/cqrs/nest-cqrs-caller.service';
import {
  ApiTags,
  ApiAcceptedResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/user.response.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdateUserCommand } from '../../application/commands/update-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';
import {
  IUserRequest,
  JwtAuthGuard,
  Role,
  Roles,
  RolesGuard,
  User,
} from '@app/shared';
import { DeleteUserCommand } from '../../application/commands/delete-user.command';
import { UserForgotPasswordCommand } from '../../application/commands/user-forgot-password.command';
import { GetListUserQueryDto } from '../dtos/get-list-users.dto';
import { GetListUserQuery } from '../../application/queries/get-list-user.query';
import { UserEmailDto } from '../dtos/user-email.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly cqrsCaller: NestCqrsCaller) {}

  @Put('me')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Update current user' })
  @ApiAcceptedResponse({ type: UserResponseDto })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUserRequest,
  ): Promise<UserResponseDto> {
    const command = new UpdateUserCommand(user.userId, updateUserDto);
    const updatedUser = await this.cqrsCaller.dispatch(command);
    if (!user || !(updatedUser instanceof UserResponseDto))
      throw new InternalServerErrorException('Error creating user');
    return updatedUser;
  }

  @Get('me')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Retrieve current user' })
  @ApiAcceptedResponse({ type: UserResponseDto })
  async getUser(@User() user: IUserRequest): Promise<UserResponseDto> {
    const query = new GetUserQuery(user.userId);
    const result = await this.cqrsCaller.query(query);
    if (!user || !(result instanceof UserResponseDto))
      throw new InternalServerErrorException('Error creating user');
    return result;
  }

  @Delete('me')
  @Roles(Role.User)
  @ApiOperation({ summary: 'Logically delete the current user' })
  @ApiAcceptedResponse({ type: UserResponseDto })
  async deleteUser(@User() user: IUserRequest): Promise<UserResponseDto> {
    const command = new DeleteUserCommand(user.userId);
    const deletedUser = await this.cqrsCaller.dispatch(command);
    if (!deletedUser || !(deletedUser instanceof UserResponseDto))
      throw new InternalServerErrorException('Error deleting user');
    return deletedUser;
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve a list of User' })
  @ApiResponse({
    status: 200,
    description: 'The list of User has been retrieved successfully.',
    type: [UserResponseDto],
  })
  async getList(
    @Query() query: GetListUserQueryDto,
  ): Promise<UserResponseDto[]> {
    const { page, limit, sortField, sortOrder, ...userFilters } = query;
    return this.cqrsCaller.query(
      new GetListUserQuery(userFilters, { page, limit, sortField, sortOrder }),
    );
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a forgot password email' })
  @ApiAcceptedResponse({
    description: 'Forgot password email sent',
    example: {
      message: 'Forgot password email sent',
    },
  })
  async userForgotPassword(
    @Body() body: UserEmailDto,
  ): Promise<{ message: string }> {
    const command = new UserForgotPasswordCommand(body);
    await this.cqrsCaller.dispatch(command);
    return { message: 'Forgot password email sent' };
  }
}
