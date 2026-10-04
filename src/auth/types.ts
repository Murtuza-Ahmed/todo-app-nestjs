import type { Request } from 'express';
import type { User } from '../user/entities/user.entity';

/**
 * Express request after the JwtAuthGuard / JwtStrategy has run.
 * `user` is the authenticated User entity (without the password hash,
 * since the password column is `select: false`).
 */
export interface AuthenticatedRequest extends Request {
  user: User;
}
