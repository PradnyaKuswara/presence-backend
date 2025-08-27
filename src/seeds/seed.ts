import 'dotenv/config';
import { AppDataSource } from 'src/data-source';
import { encrypt } from 'src/helpers/hash';
import { Role } from 'src/roles/entities/role.entity';
import { School } from 'src/schools/entities/school.entity';
import { User } from 'src/users/entities/user.entity';

async function seed() {
  await AppDataSource.initialize();

  await AppDataSource.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "roles" RESTART IDENTITY CASCADE');
  await AppDataSource.query(
    'TRUNCATE TABLE "schools" RESTART IDENTITY CASCADE',
  );

  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const schoolRepo = AppDataSource.getRepository(School); // Assuming School entity exists

  await roleRepo.insert([{ name: 'Super Admin' }, { name: 'Teacher' }]);

  const newSchool = new School();
  newSchool.name = 'Example School';
  newSchool.address = '123 Example St';
  newSchool.email = 'school@gmail.com';
  newSchool.phone = '1234567890';
  newSchool.logo = 'logo.png';

  await schoolRepo.save(newSchool);

  const adminRole = await roleRepo.findOneBy({ name: 'Super Admin' });
  const teacherRole = await roleRepo.findOneBy({ name: 'Teacher' });
  const school = await schoolRepo.findOne({
    where: { name: 'Example School' },
  });

  if (!adminRole || !teacherRole) {
    throw new Error('One or more roles not found after insertion');
  }

  if (!school) {
    throw new Error('School not found after insertion');
  }

  const newUser = new User();
  newUser.full_name = 'superadmin';
  newUser.email = 'superadmin@gmail.com';
  newUser.password = await encrypt('admin123');
  newUser.role = adminRole;
  newUser.school = school;
  newUser.isActive = true;
  newUser.isEmailVerified = true;
  await userRepo.save(newUser);

  await AppDataSource.destroy();
  console.log('Database seeded successfully');
}

seed().catch((error) => {
  console.error('Error during data source initialization:', error);
});
