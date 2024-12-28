import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  enterRole?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  photo?: string;
}
