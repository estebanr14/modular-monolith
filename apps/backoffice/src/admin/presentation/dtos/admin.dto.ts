import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  Length,
  IsDateString,
} from 'class-validator';
import { IAdmin } from '../../domain/entities/admin.interface';

export class AdminDto implements IAdmin {
  @ApiProperty({
    description: 'Unique identifier of the admin',
    example: '60f718c9b7a8c00015d3f2c4',
  })
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: 'Email address of the admin',
    example: 'admin@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Hashed email address of the admin' })
  @IsString()
  readonly emailHash: string;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'securePassword123',
  })
  @IsString()
  @Length(6, 50)
  readonly password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+12345678910',
  })
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty({ description: 'Name of the admin', example: 'John' })
  @IsString()
  @Length(1, 50)
  readonly name: string;

  @ApiProperty({ description: 'Lastname of the admin', example: 'Doe' })
  @IsString()
  @Length(1, 50)
  readonly lastname: string;

  @ApiProperty({
    description: 'Account status',
    example: 'active',
    enum: ['active', 'inactive'],
  })
  @IsString()
  readonly status: string;

  @ApiProperty({
    description: 'Last login date of the admin',
    required: false,
    example: '2023-10-15T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  readonly lastLoginDate?: Date;

  @ApiProperty({
    description: 'Last login IP address of the admin',
    required: false,
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  readonly lastLoginIp?: string;
}
