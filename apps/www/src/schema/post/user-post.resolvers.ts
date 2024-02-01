import { Post } from "@generated/type-graphql";
import type { TContext } from "@/app/api/graphql/_types";
import { PostsWithCursor, UserPostsInput } from "./post.types";
import { Resolver, Query, Ctx, Arg, Directive } from "type-graphql";

@Resolver(() => Post)
export class UserPostResolver {
  @Query(() => PostsWithCursor)
  @Directive("@cacheControl(maxAge: 60)")
  async getUserPosts(
    @Ctx() ctx: TContext,
    @Arg("input") input: UserPostsInput,
  ): Promise<PostsWithCursor> {
    try {
      const posts = await ctx.prisma.post.findMany({
        where: {
          parentId: input.isComment ? { not: null } : null,
          authorId: input.authorId,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          author: true,
          tags: true,
          upvotes: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        ...(input.cursorId && {
          skip: 1,
          cursor: {
            id: input.cursorId,
          },
        }),
      });

      if (posts.length === 0) {
        return {
          data: [],
          cursorId: "",
        };
      }

      return {
        data: posts,
        cursorId: posts[posts.length - 1].id,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
