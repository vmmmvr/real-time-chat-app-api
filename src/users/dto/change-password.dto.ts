// src/users/dto/change-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123', description: 'Current password of the user' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newPassword123', description: 'New password for the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
