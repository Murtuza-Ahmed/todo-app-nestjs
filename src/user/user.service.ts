import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Constants } from '@/utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email.toLowerCase();

    const exitingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (exitingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      email,
      password: hashedPassword,
      role: Constants.ROLE.NORMAL_ROLE,
    });
    const saved = await this.userRepository.save(user);
    // Never leak the password hash in API responses
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = saved;
    return safeUser;
  }

  /**
   * Finds a user by their ID. Used by todo operations and profile lookups.
   * Returns null when the user does not exist so callers can decide the
   * right error (404 vs 401) for their own context.
   */
  async findUserById(id: number): Promise<User | null> {
    if (!id || Number.isNaN(Number(id))) {
      return null;
    }
    return this.userRepository.findOne({ where: { id: Number(id) } });
  }

  /**
   * Finds a user by email WITHOUT the password hash (password column is
   * `select: false`). Used by the JWT strategy to resolve the request user.
   * Returns null instead of throwing so auth flows can answer 401.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Finds a user by email INCLUDING the password hash.
   * Only used by the local (login) strategy for credential checking.
   */
  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'role',
        'createdAt',
      ],
    });
  }

  /**
   * Compares a plain password against a bcrypt hash.
   */
  async validatePassword(password: string, hashedPassword: string) {
    if (!password || !hashedPassword) {
      return false;
    }
    return await bcrypt.compare(password, hashedPassword);
  }

  // Find all users (password hashes are never selected)
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Find one user by id, 404 when missing
  async findOne(id: number): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Delete a user by id, 404 when missing
  async remove(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // remove() (not delete()) so cascades/listeners run and todos are cleaned up
    await this.userRepository.remove(user);
    return { deleted: true, id: user.id };
  }
}
