import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleGuard } from '@/auth/guard/role.guard';
import { Constants } from '@/utils/constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

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
@ApiTags('User')

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

  /**
   * Endpoint to retrieve all users, protected by RoleGuard to allow only admin users to access this endpoint
  //*  This decorator indicates that all endpoints in this controller require JWT authentication, referencing the 'JWT-auth' security scheme defined in the Swagger configuration in main.ts.
   * @returns 
   */
  @Get()
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLE.ADMIN_ROLE))
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

  /**
   * Endpoint to delete a user, protected by RoleGuard to allow only admin users to access this endpoint
   * @param id 
   * @returns 
   */
  @Delete('delete/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLE.ADMIN_ROLE))
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(+id);
    return {
      success: true,
      message: 'User deleted successfully',
      data: result,
    };
  }
}
