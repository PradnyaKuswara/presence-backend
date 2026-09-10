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

  const schema = process.env.DB_SCHEMA || 'public';
  await AppDataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await AppDataSource.query(
    `TRUNCATE TABLE "${schema}"."users" RESTART IDENTITY CASCADE`,
  );
  await AppDataSource.query(
    `TRUNCATE TABLE "${schema}"."roles" RESTART IDENTITY CASCADE`,
  );
  await AppDataSource.query(
    `TRUNCATE TABLE "${schema}"."schools" RESTART IDENTITY CASCADE`,
  );

  // Insert Global System School with ID 0 for Global Super Admin
  await AppDataSource.query(
    `INSERT INTO "${schema}"."schools" ("id", "uuid", "name", "address", "email", "phone") VALUES (0, '00000000-0000-0000-0000-000000000000', 'Global System', 'Global System', 'global@presence.com', '0')`,
  );

  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const schoolRepo = AppDataSource.getRepository(School);

  // Seed roles: Super Admin Global, Super Admin, Admin, User
  await roleRepo.insert([
    { name: ROLE.SUPER_ADMIN_GLOBAL },
    { name: ROLE.SUPER_ADMIN },
    { name: ROLE.ADMIN },
    { name: ROLE.USER },
  ]);

  // Seed default school
  const defaultSchool = new School();
  defaultSchool.name = 'SMAN 1 Semarapura';
  defaultSchool.address = 'Jl. Flamboyan No. 1, Semarapura';
  defaultSchool.email = 'ekasma@gmail.com';
  defaultSchool.phone = '0366123456';
  defaultSchool.logo = 'logo.png';
  await schoolRepo.save(defaultSchool);

  const superAdminGlobalRole = await roleRepo.findOneBy({
    name: ROLE.SUPER_ADMIN_GLOBAL,
  });

  if (!superAdminGlobalRole) {
    throw new Error('Super Admin Global role not found after insertion');
  }

  // Seed 1 user: Super Admin Global (Password: Password1, school_id: 0)
  const superAdminGlobalUser = new User();
  superAdminGlobalUser.full_name = 'Super Admin Global';
  superAdminGlobalUser.email = 'superadminglobal@gmail.com';
  superAdminGlobalUser.password = await encrypt('Password1');
  superAdminGlobalUser.role = superAdminGlobalRole;
  superAdminGlobalUser.school_id = 0;
  superAdminGlobalUser.isActive = true;
  superAdminGlobalUser.isEmailVerified = true;

  await userRepo.save(superAdminGlobalUser);

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
