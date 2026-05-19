import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "John", description: "The first name of the user" })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: "Doe", description: "The last name of the user" })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: "john.doe@example.com", description: "The email address of the user" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Password123!", description: "The password of the user" })
  @IsStrongPassword()
  password!: string;
}
