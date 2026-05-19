import 'dotenv/config';
import { AppDataSource } from './src/config/data-source';
import { seedAdmin } from './src/database/seeds/admin.seed';

/**
 * This file is responsible for seeding the database with initial data. It initializes the data source using the configuration defined in `data-source.ts`, and then calls the `seedAdmin` function to seed an admin user into the database. If the admin user already exists, it will skip the seeding process. After seeding is completed, it logs a success message and exits the process. If any errors occur during initialization or seeding, they are caught and logged to the console.
 */
AppDataSource.initialize()
  .then(async () => {

    await seedAdmin(AppDataSource);

    console.log('Seeding completed');

    process.exit();
  })
  .catch((error) => {
    console.log(error);
  });