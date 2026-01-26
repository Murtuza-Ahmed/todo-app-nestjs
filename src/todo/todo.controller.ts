import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post('create/:userId')
  async createTodo(@Body(ValidationPipe) createTodoDto: CreateTodoDto, @Param('userId') userId: number) {
    const todo = await this.todoService.create(createTodoDto, Number(userId))
    return {
      success: true,
      message: 'Todo created successfully',
      data: todo,
    };
  }

  @Get('completed/:userId')
  async findCompletedTodos(@Param('userId') userId: number) {
    const todos = await this.todoService.findTodosByUser(Number(userId), true);
    return {
      success: true,
      message: 'Completed todos retrieved successfully',
      data: todos,
    };
  }

  @Get('not-completed/:userId')
  async findNotCompletedTodos(@Param('userId') userId: number) {
    const todos = await this.todoService.findTodosByUser(Number(userId), false);
    return {
      success: true,
      message: 'Not completed todos retrieved successfully',
      data: todos,
    };
  }

  @Patch('update/:id')
  async completeTodo(@Param('id') id: number) {
    const todo = await this.todoService.updateTodoStatus(Number(id));
    return {
      success: true,
      message: 'Todo marked as completed',
      data: todo,
    };
  }

  @Delete('delete/:id')
  async deleteTodo(@Param('id') id: number) {
    await this.todoService.removeTodo(Number(id));

    return {
      success: true,
      message: 'Todo deleted successfully',
    };
  }
}
