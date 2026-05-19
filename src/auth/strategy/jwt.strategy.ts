import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

/**
 * JwtStrategy is a Passport strategy for handling JSON Web Token (JWT) authentication. It extends the PassportStrategy class and implements the validate method to authenticate users based on the JWT token provided in the request. The strategy uses the UserService to find a user by their email address extracted from the JWT payload. If a valid user is found, it returns the user object; otherwise, it throws an UnauthorizedException.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_KEY'),
    });
  }

  /**
   * Validates the JWT token and finds the corresponding user.
   * @param payload 
   * @returns 
   */
  async validate(payload: any) {
    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }
}