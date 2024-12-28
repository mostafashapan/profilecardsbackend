import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { UpdateUserInput } from './dto/update-user.input';
import { AddUserInput } from './dto/add-user.input';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Query(() => [User])
  async getAllUsers(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number
  ): Promise<User[]> {
    return this.userService.findAll(page, limit);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Args('photo', { type: () => GraphQLUpload, nullable: true }) photo: FileUpload,
  ): Promise<User> {
    return this.userService.update(id, updateUserInput, photo);
  }

//   @Mutation(() => User)
//   async addUser(
//     @Args('addUserInput') addUserInput: AddUserInput,
//     @Args('photo', { type: () => GraphQLUpload, nullable: true }) photo: FileUpload,
//   ): Promise<User> {
//     return this.userService.addUser(addUserInput, photo);
//   }
@Mutation(() => User)
async addUser(
  @Args('addUserInput') addUserInput: AddUserInput,
  @Args('photo', { type: () => GraphQLUpload, nullable: true }) photo: FileUpload,
): Promise<User> {
  return this.userService.addUser(addUserInput, photo);
}

  @Query(() => String)
  async checkDbConnection(): Promise<string> {
    return this.userService.checkDbConnection();
  }

  @Mutation(() => Boolean)
  async deleteUsers(
    @Args('ids', { type: () => [Int] }) ids: number[],
  ): Promise<boolean> {
    return this.userService.deleteUsers(ids);
  }
}
