import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './models/user.model';  // Import User entity

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Register the User entity with TypeORM
  ],
  providers: [UserService, UserResolver],  // Provide the service and resolver
  exports: [UserService],  // Export the service if other modules need it
})
export class UserModule {}
