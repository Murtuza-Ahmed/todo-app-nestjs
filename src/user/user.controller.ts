import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleGuard } from '@/auth/guard/role.guard';
import { Constants } from '@/utils/constants';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '@/auth/types';

/**
 * UserController is responsible for handling incoming HTTP requests related to user operations and returning responses to the client. It uses the UserService to perform business logic and interact with the database.
 *
 * Endpoints:
 * - POST /user/create - Create a new user (public registration)
 * - GET /user - Retrieve all users (admin only)
 * - GET /user/:id - Retrieve a user by id (admin, or the user themself)
 * - DELETE /user/delete/:id - Delete a user (admin only)
 */
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  /**
   * Endpoint to retrieve all users, protected by RoleGuard to allow only admin users to access this endpoint
   * This decorator indicates that all endpoints in this controller require JWT authentication, referencing the 'JWT-auth' security scheme defined in the Swagger configuration in main.ts.
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

  /**
   * Retrieve a single user. Admins may fetch anyone; a normal user may only
   * fetch their own profile.
   */
  @Get(':id')
  @ApiSecurity('JWT-auth')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const requester = req.user;
    const isAdmin = requester.role === Constants.ROLE.ADMIN_ROLE;
    if (!isAdmin && requester.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    const user = await this.userService.findOne(id);
    return {
      success: true,
      message: 'User found successfully',
      data: user,
    };
  }

  /**
   * Endpoint to delete a user, protected by RoleGuard to allow only admin users to access this endpoint
   */
  @Delete('delete/:id')
  @ApiSecurity('JWT-auth')
  @UseGuards(new RoleGuard(Constants.ROLE.ADMIN_ROLE))
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.remove(id);
    return {
      success: true,
      message: 'User deleted successfully',
      data: result,
    };
  }
}
