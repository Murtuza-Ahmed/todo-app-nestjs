import { User } from "../../user/entities/user.entity";
import { DataSource } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Constants } from "../../utils/constants";

/**
 * Seeds the admin user into the database if it does not already exist. The admin user's email and password are retrieved from environment variables. The password is hashed before being stored in the database. If an admin user with the specified email already exists, the seeding process is skipped.
 * @param dataSource 
 * @returns 
 */
export async function seedAdmin(dataSource: DataSource) {

  const userRepository = dataSource.getRepository(User);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existingAdmin = await userRepository.findOne({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping seeding.');
    return;
  }

  const hashPassword = await bcrypt.hash(adminPassword!, 10);

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