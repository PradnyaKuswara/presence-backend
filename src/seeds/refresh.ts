import 'dotenv/config';
import { AppDataSource } from 'src/data-source';
import { runSeed } from './seed';

async function refresh() {
  console.log('Initializing database connection for refresh...');
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  console.log('Dropping database schema and re-synchronizing...');
  await AppDataSource.synchronize(true);
  console.log('Database schema refreshed successfully.');

  console.log('Seeding initial data...');
  await runSeed();

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  console.log('Database refresh and seed completed successfully!');
}

refresh().catch((error) => {
  console.error('Error during database refresh:', error);
  process.exit(1);
});
