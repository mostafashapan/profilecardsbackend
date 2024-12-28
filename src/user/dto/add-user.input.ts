import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddUserInput {
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
