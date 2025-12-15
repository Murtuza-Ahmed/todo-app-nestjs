import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Constants } from 'src/utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {

    const exitingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() }
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
    const savedUser = await this.userRepository.save(user);
    return {
      success: true,
      message: 'User created successfully',
      data: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      }
    }
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOneOrFail({ where: { email: email } })
  }


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

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('User id is required');
    }
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException('User not found');
    }
    return {
      success: true,
      data: result,
      message: 'User deleted successfully',
    };
  }
}
