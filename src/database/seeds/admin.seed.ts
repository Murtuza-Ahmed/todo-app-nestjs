import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Constants } from '../../utils/constants';

/**
 * Seeds the admin user if it does not already exist. The admin email and
 * password come from ADMIN_EMAIL / ADMIN_PASSWORD. Fails fast with a clear
 * message when they are missing instead of writing a broken row.
 */
export async function seedAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Cannot seed admin user: ADMIN_EMAIL and ADMIN_PASSWORD must both be set in the environment.',
    );
  }

  const existingAdmin = await userRepository.findOne({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping seeding.');
    return;
  }

  const hashPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = userRepository.create({
    firstName: 'Murtuza',
    lastName: 'Admin',
    email: adminEmail,
    password: hashPassword,
    role: Constants.ROLE.ADMIN_ROLE,
  });

  await userRepository.save(adminUser);

  console.log('Admin user seeded successfully.');
}
