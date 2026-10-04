import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from './../src/auth/guard/jwt.guard';

/**
 * Full-application smoke tests. These need a real database, so the suite is
 * skipped when DATABASE_URL is not set (e.g. CI without a database).
 * Nothing here writes to the database.
 */
const describeIfDb = process.env.DATABASE_URL ? describe : describe.skip;

describeIfDb('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalGuards(new JwtAuthGuard());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves the swagger docs', () => {
    return request(app.getHttpServer()).get('/api-docs/').expect(200);
  });

  it('rejects unauthenticated access to protected routes with 401', () => {
    return request(app.getHttpServer()).get('/todo').expect(401);
  });

  it('answers 401 for login with unknown credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nobody@example.com', password: 'wrong-password' })
      .expect(401);
  });

  it('rejects registration with an invalid body', () => {
    return request(app.getHttpServer())
      .post('/user/create')
      .send({ email: 'not-an-email', password: 'x' })
      .expect(400);
  });
});
