import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

/**
 * AuthController is responsible for handling incoming HTTP requests related to authentication and returning responses to the client. It uses the AuthService to perform authentication logic and generate JWT tokens. The controller defines an endpoint for user login, which uses the LocalStrategy to authenticate the user based on their email and password. If the authentication is successful, it returns a response containing the authenticated user's information and a JWT token.
 * 
 * Endpoints:
 * - POST /auth/login - Authenticate a user and generate a JWT token
 */
@Controller('auth')
@ApiTags('Auth') // This decorator is used to group the endpoints of this controller under the "Auth" tag in the Swagger documentation, making it easier to navigate and understand the API structure in the generated documentation.
export class AuthController {

  constructor(private authService: AuthService) { }

  /**
   * Handles the user login endpoint. It uses the LocalStrategy to authenticate the user based on their email and password. If the authentication is successful, it returns a response containing the authenticated user's information and a JWT token.
   * @param req 
   * @returns 
   */
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req, @Body() loginDto: LoginDto) {

    const authenticatedUser = await this.authService.login(req.user);

    return {
      success: true,
      message: 'Login successful',
      data: authenticatedUser,
    };
  }
}