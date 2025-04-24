import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Logger,
  Res,
  UseGuards,
} from '@nestjs/common';
import { NestCqrsCaller } from '@app/shared/cqrs/nest-cqrs-caller.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  ChangePasswordDto,
  JwtAuthGuard,
  LoggerDecorator,
  Role,
  Roles,
  RolesGuard,
  User,
} from '@app/shared';
import { LoginDto } from '@app/shared';
import { RefreshTokenDto } from '@app/shared';
import { AdminRefreshTokenCommand } from '../../application/commands/admin-refresh-token.command';
import { AuthResponseUtil } from '@app/shared';
import { Response } from 'express';
import { AdminLoginCommand } from '../../application/commands/admin-login.command';
import { AdminChangePasswordCommand } from '../../application/commands/admin-change-password.command';
import { AdminValidateMFACommand } from '../../application/commands/admin-validate-mfa.command';
import { ValidateMFADto } from '../dtos/validate-mfa.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AdminAuthController {
  constructor(private readonly cqrsCaller: NestCqrsCaller) {}
  private readonly logger = new Logger(AdminAuthController.name);

  @Post('login')
  @LoggerDecorator({ printRequest: false, printResponse: true })
  @ApiOperation({ summary: 'Validate admin password and sends MFA code' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ description: 'Email with MFA sent' })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const command = new AdminLoginCommand(loginDto.email, loginDto.password);
    await this.cqrsCaller.dispatch<AdminLoginCommand>(command, false, true);
    res.json({ message: 'Email with MFA sent' });
  }

  @Post('mfa')
  @LoggerDecorator({ printRequest: false, printResponse: true })
  @ApiOperation({ summary: 'Login an admin using MFA code' })
  @ApiBody({ type: ValidateMFADto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  async validateMfa(
    @Body() validateMFADto: ValidateMFADto,
    @Res() res: Response,
  ) {
    const command = new AdminValidateMFACommand(
      validateMFADto.email,
      validateMFADto.code,
    );
    const result = await this.cqrsCaller.dispatch<
      AdminValidateMFACommand,
      AuthResponseDto
    >(command, false, true);
    if (!result || !result.accessToken) {
      this.logger.error(`MFA error, access token not generated ${result}`);
      throw new InternalServerErrorException('Error validating MFA');
    }
    AuthResponseUtil.setAuthHeaders(
      res,
      result.accessToken,
      result.refreshToken,
    );
    res.json({ adminId: result.sub });
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
    const command = new AdminRefreshTokenCommand(refreshToken);
    const result = await this.cqrsCaller.dispatch<
      AdminRefreshTokenCommand,
      AuthResponseDto
    >(command, false, true);
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
    res.json({ adminId: result.sub });
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @LoggerDecorator({ printRequest: false, printResponse: true })
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Change password for logged in admin' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiCreatedResponse({ description: 'Password changed successfully' })
  async changePassword(@Body() body: ChangePasswordDto, @User() admin: any) {
    const command = new AdminChangePasswordCommand(
      admin.userId,
      body.oldPassword,
      body.newPassword,
    );
    await this.cqrsCaller.dispatch(command, false, true);
    return { message: 'Password changed successfully' };
  }
}
