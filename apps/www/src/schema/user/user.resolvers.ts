import { GraphQLError } from "graphql";
import { Resolver, Query, Mutation, Ctx, Arg, Directive } from "type-graphql";

import { User, Role } from "@generated/type-graphql";
import type { TContext } from "@/app/api/graphql/_types";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User)
  async getUser(
    @Arg("username", () => String) username: string,
    @Ctx() ctx: TContext,
  ): Promise<User> {
    try {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { username },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Query(() => User)
  async getCurrentUser(@Ctx() ctx: TContext): Promise<User> {
    try {
      if (!ctx.id) {
        throw new Error("Not authenticated");
      }

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Query(() => [User])
  @Directive("@cacheControl(maxAge: 60)")
  async getUsers(
    @Arg("role", () => Role) role: Role,
    @Ctx() ctx: TContext,
  ): Promise<User[]> {
    try {
      return await ctx.prisma.user.findMany({
        where: {
          role,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => String)
  async setUsername(
    @Arg("username", () => String) username: string,
    @Ctx() ctx: TContext,
  ): Promise<String> {
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    try {
      if (!usernameRegex.test(username)) {
        throw new GraphQLError("Username must be alphanumeric");
      }

      await ctx.prisma.user.update({
        where: { id: ctx.id },
        data: {
          username,
        },
      });

      return "Success";
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => String)
  async setBio(
    @Arg("bio", () => String) bio: string,
    @Ctx() ctx: TContext,
  ): Promise<String> {
    try {
      await ctx.prisma.user.update({
        where: { id: ctx.id },
        data: {
          bio,
        },
      });

      return "Success";
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => User)
  async setUserRole(
    @Arg("username", () => String) username: string,
    @Arg("role", () => Role) role: Role,
    @Ctx() ctx: TContext,
  ): Promise<User> {
    try {
      return await ctx.prisma.user.update({
        where: { username },
        data: {
          role,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
