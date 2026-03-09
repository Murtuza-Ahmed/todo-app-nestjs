import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }
  async validate(email: string, password: string): Promise<User> {

    // This method will be called by Passport to validate the user credentials
    const user: User | null = await this.userService.findUserByEmail(email.toLowerCase());

    const isPasswordValid = await this.userService.validatePassword(password, user.password);

    if (user && isPasswordValid) return user;

    if (user === undefined) throw new UnauthorizedException('Invalid email or password');

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    throw new UnauthorizedException('Invalid email or password');
  }
}