import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  Length,
  IsDateString,
  Matches,
} from 'class-validator';
import { IUser } from '../../domain/entities/user.interface';

export class UserDto implements IUser {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '60f718c9b7a8c00015d3f2c4',
  })
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: 'Unique username of the user',
    example: 'JohnDoe123',
  })
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Hashed email address of the user' })
  @IsString()
  readonly emailHash: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'securePassword123!',
  })
  @IsString()
  @Length(8, 50)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/, {
    message:
      'Password must be at least 8 characters long, contain a number, a lowercase letter, an uppercase letter, and a special character',
  })
  readonly password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+573127482378',
  })
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({ description: 'Name of the user', example: 'John' })
  @IsString()
  @Length(1, 50)
  readonly name: string;

  @ApiProperty({ description: 'Lastname of the user', example: 'Doe' })
  @IsString()
  @Length(1, 50)
  readonly lastname: string;

  @ApiProperty({ description: 'Account status', example: 'active' })
  @IsString()
  readonly status: string;

  @ApiProperty({
    description: 'Last login date of the user',
    required: false,
    example: '2023-10-15T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  readonly lastLoginDate?: Date;

  @ApiProperty({
    description: 'Last login IP address of the user',
    required: false,
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  readonly lastLoginIp?: string;

  @ApiProperty({
    description: 'Referral code of the user',
    required: false,
    example: '123',
  })
  @IsOptional()
  @IsString()
  readonly referralCode?: string;
}
