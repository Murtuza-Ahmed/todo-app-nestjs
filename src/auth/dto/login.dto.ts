import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
  @IsString()
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com'
  })
  email!: string;

  @IsStrongPassword()
  @ApiProperty({
    description: 'The password of the user',
    example: 'Password123!'
  })
  password!: string;
}