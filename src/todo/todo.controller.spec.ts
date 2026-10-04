import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;

  const service = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findTodosByUser: jest.fn(),
    updateTodo: jest.fn(),
    removeTodo: jest.fn(),
  };

  const req = { user: { id: 5, role: 'NORMAL_USER_ROLE' } } as any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: service }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createTodo uses the JWT identity, not a URL param', async () => {
    service.create.mockResolvedValue({ id: 1 });
    const res = await controller.createTodo({ title: 'x' }, req);
    expect(service.create).toHaveBeenCalledWith({ title: 'x' }, req.user);
    expect(res).toEqual({
      success: true,
      message: 'Todo created successfully',
      data: { id: 1 },
    });
  });

  it('findAllTodos scopes to the logged-in user', async () => {
    service.findAllByUser.mockResolvedValue([]);
    const res = await controller.findAllTodos(req);
    expect(service.findAllByUser).toHaveBeenCalledWith(5);
    expect(res.data).toEqual([]);
  });

  it('updateTodo passes the requester for the ownership check', async () => {
    service.updateTodo.mockResolvedValue({ id: 1 });
    await controller.updateTodo(1, { completed: true }, req);
    expect(service.updateTodo).toHaveBeenCalledWith(
      1,
      { completed: true },
      req.user,
    );
  });

  it('deleteTodo passes the requester for the ownership check', async () => {
    service.removeTodo.mockResolvedValue({ deleted: true, id: 1 });
    const res = await controller.deleteTodo(1, req);
    expect(service.removeTodo).toHaveBeenCalledWith(1, req.user);
    expect(res.success).toBe(true);
  });
});
