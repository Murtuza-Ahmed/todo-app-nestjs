import { User } from '../user/entities/user.entity';
import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * This file defines the data source configuration for the application using TypeORM. It specifies the database type, connection details (host, port, username, password, and database name) which are retrieved from environment variables. The `synchronize` option is set to true, allowing TypeORM to automatically synchronize the database schema with the defined entities. The `entities` array includes the User entity, which is used by TypeORM to manage the corresponding database table. This configuration is essential for establishing a connection to the PostgreSQL database and enabling data operations throughout the application.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),

  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,

  database: process.env.DATABASE_NAME,

  synchronize: true,

  entities: [__dirname + '/../**/*.entity{.ts,.js}', User],

  migrations: [],
});