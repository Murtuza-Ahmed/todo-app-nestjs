import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email!: string;

  // NOTE: intentionally NOT @IsStrongPassword() — login must accept whatever
  // password the user originally registered with.
  @IsString()
  @MinLength(1)
  @ApiProperty({
    description: 'The password of the user',
    example: 'Password123!',
  })
  password!: string;
}
