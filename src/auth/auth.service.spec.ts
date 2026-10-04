import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const jwtService = {
    sign: jest.fn().mockReturnValue('signed-jwt-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: jwtService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login signs a payload and strips the password', () => {
    const user: any = {
      id: 1,
      firstName: 'John',
      email: 'john@example.com',
      role: 'NORMAL_USER_ROLE',
      password: 'hashed-secret',
    };

    const result = service.login(user);

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      firstName: 'John',
      email: 'john@example.com',
      role: 'NORMAL_USER_ROLE',
    });
    expect(result.accessToken).toBe('signed-jwt-token');
    expect(result.user).not.toHaveProperty('password');
    expect(result.user.id).toBe(1);
  });
});
