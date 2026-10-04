import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

/**
 * LocalStrategy is a Passport strategy for handling username/password authentication. It extends the PassportStrategy class and implements the validate method to authenticate users based on their email and password. The strategy uses the UserService to find a user by their email and validate the provided password against the stored hashed password. If the credentials are valid, it returns the user object; otherwise, it throws an UnauthorizedException.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Validates the user's email and password. Always answers with a generic
   * 401 message so callers can't probe which emails are registered.
   */
  async validate(email: string, password: string): Promise<User> {
    const invalid = () => {
      throw new UnauthorizedException('Invalid email or password');
    };

    if (!email || !password) {
      invalid();
    }

    const user = await this.userService.findUserByEmailWithPassword(
      email.toLowerCase(),
    );
    if (!user) {
      invalid();
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user!.password,
    );
    if (!isPasswordValid) {
      invalid();
    }

    return user!;
  }
}
