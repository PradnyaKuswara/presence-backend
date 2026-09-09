import 'dotenv/config';
import { ROLE } from 'src/constants/roleConstant';
import { AppDataSource } from 'src/data-source';
import { encrypt } from 'src/helpers/hash';
import { Role } from 'src/roles/entities/role.entity';
import { School } from 'src/schools/entities/school.entity';
import { User } from 'src/users/entities/user.entity';

export async function runSeed() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  await AppDataSource.query('TRUNCATE TABLE "users" RESTART IDENTITY CASCADE');
  await AppDataSource.query('TRUNCATE TABLE "roles" RESTART IDENTITY CASCADE');
  await AppDataSource.query(
    'TRUNCATE TABLE "schools" RESTART IDENTITY CASCADE',
  );

  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const schoolRepo = AppDataSource.getRepository(School);

  await roleRepo.insert([{ name: 'Super Admin' }, { name: 'Teacher' }]);

  const newSchool = new School();
  newSchool.name = 'SMAN 1 Semarapura';
  newSchool.address = '123 Example St';
  newSchool.email = 'ekasma@gmail.com';
  newSchool.phone = '1234567890';
  newSchool.logo = 'logo.png';

  await schoolRepo.save(newSchool);

  const adminRole = await roleRepo.findOneBy({ name: ROLE.SUPER_ADMIN });
  const teacherRole = await roleRepo.findOneBy({ name: ROLE.TEACHER });
  const school = await schoolRepo.findOne({
    where: { name: 'SMAN 1 Semarapura' },
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

  console.log('Database seeded successfully');
}

if (require.main === module) {
  runSeed()
    .then(async () => {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
    })
    .catch((error) => {
      console.error('Error during data seeding:', error);
      process.exit(1);
    });
}

