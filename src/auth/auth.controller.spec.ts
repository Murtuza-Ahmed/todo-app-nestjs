import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login wraps the service result in the envelope', () => {
    const payload = { user: { id: 1 }, accessToken: 'tok' };
    authService.login.mockReturnValue(payload);

    const req: any = { user: { id: 1 } };
    const res = controller.login(req);

    expect(authService.login).toHaveBeenCalledWith(req.user);
    expect(res).toEqual({
      success: true,
      message: 'Login successful',
      data: payload,
    });
  });
});
