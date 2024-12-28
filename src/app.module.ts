import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';  // Import Joi for validation
import { UserModule } from './user/user.module';
import { User } from './user/models/user.model';  // Explicitly import User entity

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true,  // Makes the variables globally available
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        NODE_ENV: Joi.string().valid('development', 'production').required(),
      }),  // Validate environment variables
    }),

    // Configure TypeORM to use DATABASE_URL from the .env file
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],  // Import ConfigModule to access ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),  // Get DATABASE_URL from environment variables
        entities: [User],  // Explicitly reference entities here
        synchronize: configService.get<string>('NODE_ENV') !== 'production',  // Only synchronize in non-production environments
      }),
      inject: [ConfigService],  // Inject ConfigService to access environment variables
    }),

    // Set up GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',  // Disable Playground in production
      autoSchemaFile: 'schema.gql',  // Automatically generate schema file
    }),

    UserModule,  // Your user module
  ],
  providers: [],
})
export class AppModule {}
