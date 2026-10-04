import 'dotenv/config';
import { AppDataSource } from './src/config/data-source';
import { seedAdmin } from './src/database/seeds/admin.seed';

/**
 * Seeds the database with initial data. Initializes the data source using the
 * configuration in `data-source.ts`, then runs the admin seed. Exits 0 on
 * success and 1 on failure so CI/scripts can detect a broken seed run.
 */
async function run() {
  try {
    await AppDataSource.initialize();
    await seedAdmin(AppDataSource);
    console.log('Seeding completed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

run();
