// src/auth/dto/signup.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  readonly name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique email of the user',
  })
  readonly email: string;

  @ApiProperty({
    example: 'johndoe123',
    description: 'Unique username for the user',
  })
  readonly username: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the account',
  })
  readonly password: string;
}
