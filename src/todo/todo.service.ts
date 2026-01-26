import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly userService: UserService,
  ) { }
  // CRUD Operations
  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const todo = this.todoRepository.create({
      title: createTodoDto.title,
      completed: false,
      user: user,
    })
    return await this.todoRepository.save(todo);
  }

  // async findAllTodoByUserNotCompleted(userId: number) {
  //   const user = await this.userService.findUserById(userId);
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  //   return this.todoRepository.find({
  //     // relations: ['user'],
  //     where: {
  //       user: { id: userId },
  //       completed: false
  //     },
  //   });
  // }

  // async findAllTodoByUserCompleted(userId: number) {
  //   const user = await this.userService.findUserById(userId);
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  //   return this.todoRepository.find({
  //     // relations: ['user'],
  //     where: {
  //       user: { id: userId },
  //       completed: true
  //     },
  //   })
  // }

  async findTodosByUser(userId: number, completed: boolean) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.todoRepository.find({
      where: {
        user: { id: userId },
        completed,
      }
    })
  }

  async updateTodoStatus(todoId: number) {
    if (!todoId) {
      throw new BadRequestException('Todo ID is required');
    }
    const todo = await this.todoRepository.findOne({
      where: {
        id: todoId
      }
    });
    if (!todo) {
      throw new BadRequestException('Todo not found');
    }

    todo.completed = true;

    return this.todoRepository.save(todo);
  }

  async removeTodo(todoId: number) {
    const todo = await this.todoRepository.findOne({
      where: {
        id: todoId
      }
    });
    if (!todo) {
      throw new BadRequestException('Todo not found');
    }
    await this.todoRepository.remove(todo);
  }
}
