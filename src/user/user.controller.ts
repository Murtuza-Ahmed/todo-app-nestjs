import { Controller, Get, Post, Body, Param, Delete, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * UserController is responsible for handling incoming HTTP requests related to user operations and returning responses to the client. It uses the UserService to perform business logic and interact with the database. The controller defines endpoints for creating a user, retrieving all users, retrieving a user by id, and deleting a user.
 * 
 * Endpoints:
 * - POST /user/create - Create a new user
 * - GET /user - Retrieve all users
 * - GET /user/:id - Retrieve a user by id
 * - DELETE /user/delete/:id - Delete a user
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
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
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(+id);
    return {
      success: true,
      message: 'User deleted successfully',
      data: result,
    };
  }
}
