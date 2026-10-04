import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/types';

/**
 * TodoController is responsible for handling incoming HTTP requests related to todo operations and returning responses to the client. It uses the TodoService to perform business logic and interact with the database.
 *
 * The identity always comes from the JWT — the `:userId` URL params of the
 * old API are gone. A user can only ever see and touch their own todos
 * (admins are the exception).
 *
 * Endpoints:
 * - POST /todo/create - Create a new todo for the logged-in user
 * - GET /todo - All todos of the logged-in user
 * - GET /todo/completed - Completed todos of the logged-in user
 * - GET /todo/not-completed - Pending todos of the logged-in user
 * - PATCH /todo/update/:id - Update title and/or completion status
 * - DELETE /todo/delete/:id - Delete a todo
 */
@Controller('todo')
@ApiTags('Todo') // This decorator adds a tag to the Swagger documentation for all endpoints in this controller, grouping them under the "Todo" category.
@ApiSecurity('JWT-auth') // This decorator indicates that all endpoints in this controller require JWT authentication, referencing the 'JWT-auth' security scheme defined in the Swagger configuration in main.ts.
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('create')
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const todo = await this.todoService.create(createTodoDto, req.user);
    return {
      success: true,
      message: 'Todo created successfully',
      data: todo,
    };
  }

  @Get()
  async findAllTodos(@Req() req: AuthenticatedRequest) {
    const todos = await this.todoService.findAllByUser(req.user.id);
    return {
      success: true,
      message: 'Todos retrieved successfully',
      data: todos,
    };
  }

  @Get('completed')
  async findCompletedTodos(@Req() req: AuthenticatedRequest) {
    const todos = await this.todoService.findTodosByUser(req.user.id, true);
    return {
      success: true,
      message: 'Completed todos retrieved successfully',
      data: todos,
    };
  }

  @Get('not-completed')
  async findNotCompletedTodos(@Req() req: AuthenticatedRequest) {
    const todos = await this.todoService.findTodosByUser(req.user.id, false);
    return {
      success: true,
      message: 'Not completed todos retrieved successfully',
      data: todos,
    };
  }

  @Patch('update/:id')
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const todo = await this.todoService.updateTodo(id, updateTodoDto, req.user);
    return {
      success: true,
      message: 'Todo updated successfully',
      data: todo,
    };
  }

  @Delete('delete/:id')
  async deleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const result = await this.todoService.removeTodo(id, req.user);

    return {
      success: true,
      message: 'Todo deleted successfully',
      data: result,
    };
  }
}
