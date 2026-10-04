/**
 * Load .env synchronously BEFORE the @Module decorator below is evaluated,
 * so the Observe toggle further down sees file-based keys too.
 * (ConfigModule.forRoot also loads .env later, but it never overrides keys
 * that are already in process.env, so this is safe.)
 */
import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

/**
 * Observability is truly optional: without credentials the Observe agent
 * worker would just spam "could not reach the collector" errors, so the
 * module is only registered when both keys are present.
 */
const observeAppKey = process.env.OBSERVE_APP_KEY;
const observeAppSecret = process.env.OBSERVE_APP_SECRET;
const observeEnabled = !!observeAppKey && !!observeAppSecret;

if (!observeEnabled) {
  console.warn(
    'OBSERVE_APP_KEY / OBSERVE_APP_SECRET not set — running without observability.',
  );
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
        return {
          type: 'postgres',
          // When `url` is set, individual host/port/username/password options
          // are ignored by the pg driver — so url is the single source of truth.
          url: databaseUrl,
          // Neon (and most managed Postgres) requires SSL
          ssl: { rejectUnauthorized: false },
          synchronize: configService.get<string>('DATABASE_SYNC') === 'true',
          logging: configService.get<string>('DATABASE_LOGGING') === 'true',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),
    UserModule,
    TodoModule,
    AuthModule,
    ...(observeEnabled
      ? [
          ObserveModule.forRoot({
            appKey: observeAppKey,
            appSecret: observeAppSecret,
            serviceId: 'todo-app',
          }),
        ]
      : []),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
