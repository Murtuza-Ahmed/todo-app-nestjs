import { User } from '../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * AuthService is responsible for handling authentication logic, such as validating user credentials and generating JWT tokens. It uses the JwtService to create JWT tokens based on the authenticated user's information. The service provides a login method that takes a user object, generates a JWT token with the user's details, and returns an object containing the user's information (excluding the password) and the generated access token.
 * 
 * Methods:
 * - login(user: User): Generates a JWT token for the authenticated user and returns an object containing the user's information and the access token.
 */
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  /**
   * Generates a JWT token for the authenticated user and returns an object containing the user's information and the access token.
   * @param user 
   * @returns 
   */
  async login(user: User) {

    const payload = {
      sub: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
    };
  }
}