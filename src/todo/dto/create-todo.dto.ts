import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateTodoDto {
  @IsString()
  @ApiProperty({ example: "Buy groceries", description: "The title of the todo item" })
  title!: string;
}