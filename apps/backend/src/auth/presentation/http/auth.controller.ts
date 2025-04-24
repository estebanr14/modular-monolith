import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Logger,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignupCommand } from '../../application/commands/sign-up.command';
import { NestCqrsCaller } from '@app/shared/cqrs/nest-cqrs-caller.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  ChangePasswordDto,
  IUserRequest,
  JwtAuthGuard,
  LoggerDecorator,
  Role,
  Roles,
  RolesGuard,
  User,
} from '@app/shared';
import { LoginDto } from '@app/shared';
import { UserLoginCommand } from '../../application/commands/user-login.command';
import { SignupDto } from '../dtos/sign-up.dto';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenDto } from '@app/shared';
import { UserRefreshTokenCommand } from '../../application/commands/user-refresh-token.command';
import { AuthResponseUtil } from '@app/shared';
import { Response } from 'express';
import { UserChangePasswordCommand } from '../../application/commands/user-change-password.command';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly cqrsCaller: NestCqrsCaller) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('signup')
  @LoggerDecorator({ printRequest: false, printResponse: true })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'The Auth has been successfully created.',
    type: AuthResponseDto,
  })
  @ApiBody({ type: SignupDto })
  async signup(@Body() dto: SignupDto, @Res() res: Response) {
    const command = new SignupCommand(dto);
    const result = await this.cqrsCaller.dispatch<
      SignupCommand,
      AuthResponseDto
    >(command, false, true);

    if (!result || !result.accessToken) {
      this.logger.error(`Signup error, access token not generated ${result}`);
      throw new InternalServerErrorException('Error signing up user');
    }
    AuthResponseUtil.setAuthHeaders(
      res,
      result.accessToken,
      result.refreshToken,
    );
    res.json({ userId: result.sub });
  }

  @Post('login')
  @LoggerDecorator({ printRequest: false, printResponse: true })
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const command = new UserLoginCommand(loginDto.email, loginDto.password);
    const result = await this.cqrsCaller.dispatch<
      UserLoginCommand,
      AuthResponseDto
    >(command, false, true);
    if (!result || !result.accessToken) {
      this.logger.error(
        `Error parsing response, access token not generated ${result}`,
      );
      throw new InternalServerErrorException('Error logging in user');
    }
    AuthResponseUtil.setAuthHeaders(
      res,
      result.accessToken,
      result.refreshToken,
    );
    res.json({ userId: result.sub });
  }

  @Post('refresh')
  @LoggerDecorator({ printRequest: false, printResponse: true })
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  async refresh(
    @Body() { refreshToken }: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const command = new UserRefreshTokenCommand(refreshToken);
    const result = await this.cqrsCaller.dispatch<
      UserRefreshTokenCommand,
      AuthResponseDto
    >(command);
    if (!result || !result.accessToken) {
      this.logger.error(
        `Refresh token error, access token not generated ${result}`,
      );
      throw new InternalServerErrorException('Error refreshing token');
    }
    AuthResponseUtil.setAuthHeaders(
      res,
      result.accessToken,
      result.refreshToken,
    );
    res.json({ userId: result.sub });
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @LoggerDecorator({ printRequest: false, printResponse: true })
  @Roles(Role.User)
  @ApiOperation({ summary: 'Change password for logged in user' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiCreatedResponse({ description: 'Password changed successfully' })
  async changePassword(
    @Body() body: ChangePasswordDto,
    @User() user: IUserRequest,
  ) {
    const command = new UserChangePasswordCommand(
      user.userId,
      body.oldPassword,
      body.newPassword,
    );
    await this.cqrsCaller.dispatch(command, false, true);
    return { message: 'Password changed successfully' };
  }
}
