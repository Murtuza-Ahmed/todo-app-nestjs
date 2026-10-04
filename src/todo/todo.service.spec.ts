import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';

describe('TodoService', () => {
  let service: TodoService;

  const repo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const owner = { id: 1, role: 'NORMAL_USER_ROLE' } as any;
  const stranger = { id: 2, role: 'NORMAL_USER_ROLE' } as any;
  const admin = { id: 3, role: 'ADMIN' } as any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: getRepositoryToken(Todo), useValue: repo },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a todo owned by the requester', async () => {
      repo.create.mockImplementation((d: any) => d);
      repo.save.mockImplementation(async (t: any) => ({ id: 1, ...t }));

      const todo: any = await service.create({ title: 'Buy milk' }, owner);

      expect(todo.title).toBe('Buy milk');
      expect(todo.completed).toBe(false);
      expect(todo.user).toBe(owner);
    });
  });

  describe('findTodosByUser', () => {
    it('filters by user and completion status', async () => {
      repo.find.mockResolvedValue([]);
      await service.findTodosByUser(1, true);
      expect(repo.find).toHaveBeenCalledWith({
        where: { user: { id: 1 }, completed: true },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('updateTodo', () => {
    it('throws NotFound for a missing todo', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.updateTodo(9, {}, owner)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws Forbidden when a stranger updates', async () => {
      repo.findOne.mockResolvedValue({
        id: 1,
        title: 'x',
        completed: false,
        user: owner,
      });
      await expect(
        service.updateTodo(1, { title: 'y' }, stranger),
      ).rejects.toThrow(ForbiddenException);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('lets the owner update title and status', async () => {
      const todo = { id: 1, title: 'x', completed: false, user: owner };
      repo.findOne.mockResolvedValue(todo);
      repo.save.mockImplementation(async (t: any) => t);

      const updated: any = await service.updateTodo(
        1,
        { title: 'y', completed: true },
        owner,
      );
      expect(updated.title).toBe('y');
      expect(updated.completed).toBe(true);
    });

    it("lets an admin update someone else's todo", async () => {
      const todo = { id: 1, title: 'x', completed: false, user: owner };
      repo.findOne.mockResolvedValue(todo);
      repo.save.mockImplementation(async (t: any) => t);

      await service.updateTodo(1, { completed: true }, admin);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeTodo', () => {
    it('throws NotFound for a missing todo', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.removeTodo(9, owner)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws Forbidden when a stranger deletes', async () => {
      repo.findOne.mockResolvedValue({ id: 1, user: owner });
      await expect(service.removeTodo(1, stranger)).rejects.toThrow(
        ForbiddenException,
      );
      expect(repo.remove).not.toHaveBeenCalled();
    });

    it('deletes and confirms', async () => {
      repo.findOne.mockResolvedValue({ id: 1, user: owner });
      repo.remove.mockResolvedValue(undefined);
      expect(await service.removeTodo(1, owner)).toEqual({
        deleted: true,
        id: 1,
      });
    });
  });
});
