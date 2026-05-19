import { BadRequestException, Injectable } from '@nestjs/common';
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
  ) { }

  // Create a new user
  async create(createUserDto: CreateUserDto) {

    const email = createUserDto.email.toLowerCase();

    const exitingUser = await this.userRepository.findOne({
      where: { email }
    })

    if (exitingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const user = this.userRepository.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
      role: Constants.ROLE.NORMAL_ROLE,
    })
    return await this.userRepository.save(user);
  }

  /**
   * Custom method to find a user by their ID, used for todo operations
   * Finds a user by their ID
   * @param id 
   * @returns 
   */
  findUserById(id: number) {
    const user = this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  /**
   * Custom method to find a user by their email address, used for authentication purposes
   * Finds a user by their email address
   * @param email 
   * @returns 
   */
  async findUserByEmail(email: string) {

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  /**
   * Custom method to validate a user's password against a hashed password, used for authentication purposes
   * Validates a user's password against a hashed password
   * @param password 
   * @param hashedPassword 
   * @returns 
   */
  async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Find all users
  async findAll() {
    const fetchAllUser = await this.userRepository.find();
    if (fetchAllUser.length === 0) {
      throw new BadRequestException('No users found');
    }
    return fetchAllUser;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // Delete a user by id
  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('User id is required');
    }
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException('User not found');
    }
    return result;
  }
}
