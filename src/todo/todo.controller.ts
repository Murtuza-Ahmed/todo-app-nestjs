import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

/**
 * TodoController is responsible for handling incoming HTTP requests related to todo operations and returning responses to the client. It uses the TodoService to perform business logic and interact with the database. The controller defines endpoints for creating a todo, retrieving completed and not completed todos for a user, updating the status of a todo, and deleting a todo.
 * 
 * Endpoints:
 * - POST /todo/create/:userId - Create a new todo for a user
 * - GET /todo/completed/:userId - Retrieve all completed todos for a user
 * - GET /todo/not-completed/:userId - Retrieve all not completed todos for a user
 * - PATCH /todo/update/:id - Update the status of a todo
 * - DELETE /todo/delete/:id - Delete a todo
 */
@Controller('todo')
@ApiTags('Todo')
@ApiSecurity('JWT-auth') // This decorator indicates that all endpoints in this controller require JWT authentication, referencing the 'JWT-auth' security scheme defined in the Swagger configuration in main.ts.

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
