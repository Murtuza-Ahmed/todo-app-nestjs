import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthService } from './auth.service';
import { JwtSignOptions } from '@nestjs/jwt';

/**
 * Parses JWT_EXPIRES_IN. Accepts a plain number of seconds ("3600") or a
 * duration string ("15m", "1h", "7d"). Falls back to 3600 seconds.
 */
function parseExpiresIn(raw: string | undefined): JwtSignOptions['expiresIn'] {
  const value = (raw ?? '3600').trim();
  if (/^\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  return value as JwtSignOptions['expiresIn'];
}

/**
 * AuthModule is responsible for handling authentication-related operations in the application. It imports necessary modules such as PassportModule for authentication strategies, UserModule for user-related operations, and JwtModule for handling JSON Web Tokens. The module defines the LocalStrategy for username/password authentication and JwtStrategy for validating JWT tokens. The AuthController handles incoming HTTP requests related to authentication and uses the defined strategies to authenticate users and generate JWT tokens.
 *
 * Endpoints:
 * - POST /auth/login - Authenticate a user and generate a JWT token
 */
@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
        signOptions: {
          // Accepts seconds ("3600") or duration strings ("1h", "7d").
          // NOTE: plain parseInt("1h") would silently become 1 second.
          expiresIn: parseExpiresIn(
            configService.get<string>('JWT_EXPIRES_IN'),
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService],
})
export class AuthModule {}
