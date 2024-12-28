import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';  // Import GraphQL decorators

@ObjectType()  // Decorate the class as a GraphQL ObjectType
@Entity()  // TypeORM entity decorator
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => Int)  // Mark this property as a GraphQL field
  id!: number;

  @Column()
  @Field()  // Mark as GraphQL field
  name!: string;

  @Column()
  @Field()  // Mark as GraphQL field
  role!: string;

  @Column()
  @Field()  // Mark as GraphQL field
  enterRole!: string;

  @Column()
  @Field()  // Mark as GraphQL field
  bio!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })  // Mark as GraphQL field (nullable)
  photo?: string;

  @CreateDateColumn()
  @Field()  // GraphQL field
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()  // GraphQL field
  updatedAt!: Date;
}
