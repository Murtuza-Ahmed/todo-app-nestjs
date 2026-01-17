import { Controller, Get, Post, Body, Param, Delete, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const user = this.userService.create(createUserDto);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  findAll() {
    const users = this.userService.findAll();
    return {
      success: true,
      message: 'Users found successfully',
      data: users,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const user = this.userService.findOne(id);
    return {
      success: true,
      message: 'User found successfully',
      data: user,
    };
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    const result = this.userService.remove(+id);
    return {
      success: true,
      message: 'User deleted successfully',
      data: result,
    };
  }
}
