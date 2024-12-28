import { DataSource } from 'typeorm';
import { User } from './user/models/user.model';  // Make sure the path to your User entity is correct

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,  // This will use the DATABASE_URL from your .env file
  synchronize: false,  // Do not use synchronize: true in production, it's dangerous
  logging: true,
  entities: [User],  // Register your entity (e.g., User)
  migrations: ['src/migrations/**/*.ts'],  // Path for migration files
  subscribers: [],
});
