import { User } from '../user/entities/user.entity';
import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * DataSource used by standalone scripts (seed.ts, migrations). Mirrors the
 * runtime TypeORM config in app.module.ts: the connection string in
 * DATABASE_URL is the single source of truth.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Neon (and most managed Postgres) requires SSL
  ssl: { rejectUnauthorized: false },

  synchronize: process.env.DATABASE_SYNC === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',

  entities: [__dirname + '/../**/*.entity{.ts,.js}', User],

  migrations: [],
});
