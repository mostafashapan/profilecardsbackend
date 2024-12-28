// src/user/dto/update-user.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id!: number;  // Using `!` means this will be assigned externally

  @Field()
  name!: string;

  @Field()
  role!: string;

  @Field()
  enterRole!: string;

  @Field()
  bio!: string;

  @Field({ nullable: true })
  photo?: string;
}
