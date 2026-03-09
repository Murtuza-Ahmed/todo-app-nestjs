import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {

  constructor(private jwtService: JwtService) { }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req) {
    const user: User = req.user;

    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      sub: user.id,
    }
    return {
      success: true,
      message: 'Login successful',
      data: req.user,
      token: this.jwtService.sign(payload),
    }
  }
}
