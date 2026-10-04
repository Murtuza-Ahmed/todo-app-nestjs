import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;

  const repo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@Example.com',
      password: 'Password123!',
    };

    it('lowercases email, hashes password and never returns it', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockImplementation((d: any) => d);
      repo.save.mockImplementation(async (u: any) => ({ id: 1, ...u }));

      const result: any = await service.create(dto);

      expect(result.email).toBe('john@example.com');
      expect(result).not.toHaveProperty('password');
      expect(repo.save).toHaveBeenCalledTimes(1);
      const savedArg = repo.save.mock.calls[0][0];
      expect(savedArg.password).not.toBe(dto.password);
      expect(savedArg.role).toBe('NORMAL_USER_ROLE');
    });

    it('throws BadRequest when the email is taken', async () => {
      repo.findOne.mockResolvedValue({ id: 1, email: 'john@example.com' });
      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findUserById', () => {
    it('returns the user when found', async () => {
      repo.findOne.mockResolvedValue({ id: 2 });
      expect(await service.findUserById(2)).toEqual({ id: 2 });
    });

    it('returns null for a missing user', async () => {
      repo.findOne.mockResolvedValue(null);
      expect(await service.findUserById(999)).toBeNull();
    });

    it('returns null for garbage ids without hitting the db', async () => {
      expect(await service.findUserById(NaN)).toBeNull();
      expect(repo.findOne).not.toHaveBeenCalled();
    });
  });

  describe('findUserByEmail', () => {
    it('returns null instead of throwing when missing', async () => {
      repo.findOne.mockResolvedValue(null);
      expect(await service.findUserByEmail('no@pe.com')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('compares against the bcrypt hash', async () => {
      const hash = await bcrypt.hash('secret123', 4);
      expect(await service.validatePassword('secret123', hash)).toBe(true);
      expect(await service.validatePassword('wrong', hash)).toBe(false);
    });

    it('returns false for empty inputs', async () => {
      expect(await service.validatePassword('', 'hash')).toBe(false);
    });
  });

  describe('findAll', () => {
    it('returns an empty array when there are no users', async () => {
      repo.find.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('throws NotFound when the user is missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(5)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('throws NotFound when the user is missing', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.remove(5)).rejects.toThrow(NotFoundException);
    });

    it('removes via the entity manager and confirms', async () => {
      repo.findOne.mockResolvedValue({ id: 7 });
      repo.remove.mockResolvedValue(undefined);
      expect(await service.remove(7)).toEqual({ deleted: true, id: 7 });
      expect(repo.remove).toHaveBeenCalledTimes(1);
    });
  });
});
