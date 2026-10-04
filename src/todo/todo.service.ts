import {
  NotFoundException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Constants } from '@/utils/constants';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  /**
   * Creates a new todo for the authenticated user.
   */
  async create(createTodoDto: CreateTodoDto, owner: User): Promise<Todo> {
    const todo = this.todoRepository.create({
      title: createTodoDto.title,
      completed: false,
      user: owner,
    });
    return this.todoRepository.save(todo);
  }

  /**
   * All todos of a user, newest first.
   */
  async findAllByUser(userId: number): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Finds todos of a user by completion status.
   */
  async findTodosByUser(userId: number, completed: boolean): Promise<Todo[]> {
    return this.todoRepository.find({
      where: {
        user: { id: userId },
        completed,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Updates a todo's title and/or completion status.
   * Only the owner (or an admin) may update it.
   */
  async updateTodo(
    todoId: number,
    updateTodoDto: UpdateTodoDto,
    requester: User,
  ): Promise<Todo> {
    const todo = await this.loadTodoOr404(todoId);
    this.assertOwnership(todo, requester);

    if (updateTodoDto.title !== undefined) {
      todo.title = updateTodoDto.title;
    }
    if (updateTodoDto.completed !== undefined) {
      todo.completed = updateTodoDto.completed;
    }

    return this.todoRepository.save(todo);
  }

  /**
   * Deletes a todo. Only the owner (or an admin) may delete it.
   */
  async removeTodo(
    todoId: number,
    requester: User,
  ): Promise<{ deleted: true; id: number }> {
    const todo = await this.loadTodoOr404(todoId);
    this.assertOwnership(todo, requester);

    await this.todoRepository.remove(todo);
    return { deleted: true, id: todoId };
  }

  private async loadTodoOr404(todoId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId },
      relations: ['user'],
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  private assertOwnership(todo: Todo, requester: User): void {
    const isOwner = todo.user.id === requester.id;
    const isAdmin = requester.role === Constants.ROLE.ADMIN_ROLE;
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You do not own this todo');
    }
  }
}
