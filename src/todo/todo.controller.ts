import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post('create')
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    const todo = await this.todoService.create(createTodoDto, req.user.id)
    return {
      success: true,
      message: 'Todo created successfully',
      data: todo,
    };
  }

  @Get('completed')
  async findCompletedTodos(@Req() req) {
    const todos = await this.todoService.findTodosByUser(req.user.id, true);
    return {
      success: true,
      message: 'Completed todos retrieved successfully',
      data: todos,
    };
  }

  @Get('not-completed')
  async findNotCompletedTodos(@Req() req) {
    const todos = await this.todoService.findTodosByUser(req.user.id, false);
    return {
      success: true,
      message: 'Not completed todos retrieved successfully',
      data: todos,
    };
  }

  @Patch(':id/update')
  async completeTodo(@Param('id') id: number, @Req() req) {
    const todo = await this.todoService.updateTodoStatus(id, req.user.id);
    return {
      success: true,
      message: 'Todo marked as completed',
      data: todo,
    };
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: number, @Req() req) {
    await this.todoService.removeTodo(id, req.user.id);

    return {
      success: true,
      message: 'Todo deleted successfully',
    };
  }
}
