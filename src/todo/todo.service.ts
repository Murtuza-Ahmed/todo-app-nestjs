import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
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
  async create(createTodoDto: CreateTodoDto, userId: number) {
    let todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.completed = false;
    todo.date = new Date().toLocaleString();
    todo.user = await this.userService.findUserById(userId); // Set user to null or assign a user entity if available
    return this.todoRepository.save(todo);
  }

  findAllTodoByUserNotCompleted(userId: number) {
    return this.todoRepository.find({
      relations: ['user'],
      where: { user: { id: userId }, completed: false },
    });
  }

  findAllTodoByUserCompleted(userId: number) {
    return this.todoRepository.find({
      relations: ['user'],
      where: { user: { id: userId }, completed: true },
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
