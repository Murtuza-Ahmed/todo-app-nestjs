import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const admin = { id: 1, role: 'ADMIN' };
  const user = { id: 2, role: 'NORMAL_USER_ROLE' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: service }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create wraps the service result in the envelope', async () => {
    service.create.mockResolvedValue({ id: 1 });
    const res = await controller.create({} as any);
    expect(res).toEqual({
      success: true,
      message: 'User created successfully',
      data: { id: 1 },
    });
  });

  it('findAll wraps the service result in the envelope', async () => {
    service.findAll.mockResolvedValue([]);
    const res = await controller.findAll();
    expect(res.success).toBe(true);
    expect(res.data).toEqual([]);
  });

  it('findOne lets an admin fetch anyone', async () => {
    service.findOne.mockResolvedValue({ id: 9 });
    const res = await controller.findOne(9, { user: admin } as any);
    expect(res.data).toEqual({ id: 9 });
  });

  it('findOne lets a user fetch themself', async () => {
    service.findOne.mockResolvedValue({ id: 2 });
    const res = await controller.findOne(2, { user } as any);
    expect(res.data).toEqual({ id: 2 });
  });

  it('findOne forbids a user fetching someone else', async () => {
    await expect(controller.findOne(9, { user } as any)).rejects.toThrow(
      ForbiddenException,
    );
    expect(service.findOne).not.toHaveBeenCalled();
  });
});
