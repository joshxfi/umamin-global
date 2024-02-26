import { Tag } from "@umamin-global/db/dist/generated/type-graphql";
import type { TContext } from "@/app/api/graphql/_types";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Tag)
export class TagResolver {
  @Query(() => [Tag])
  async getTags(@Ctx() ctx: TContext): Promise<Tag[]> {
    try {
      return await ctx.prisma.tag.findMany();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Tag)
  async addTag(
    @Arg("name", () => String) name: string,
    @Ctx() ctx: TContext
  ): Promise<Tag> {
    try {
      return await ctx.prisma.tag.create({
        data: {
          name,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => String)
  async removeTag(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: TContext
  ): Promise<String> {
    try {
      await ctx.prisma.tag.delete({
        where: { id },
      });

      return "Success";
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Tag)
  async addTagToPost(
    @Arg("tagName", () => String) tagName: string,
    @Arg("postId", () => ID) postId: string,
    @Ctx() ctx: TContext
  ): Promise<Tag> {
    try {
      return await ctx.prisma.tag.update({
        where: {
          name: tagName,
        },
        data: {
          posts: {
            connect: { id: postId },
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => String)
  async removeTagOnPost(
    @Arg("tagName", () => String) tagName: string,
    @Arg("postId", () => ID) postId: string,
    @Ctx() ctx: TContext
  ): Promise<String> {
    try {
      await ctx.prisma.tag.update({
        where: {
          name: tagName,
        },
        data: {
          posts: {
            disconnect: {
              id: postId,
            },
          },
        },
      });

      return "Success";
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
