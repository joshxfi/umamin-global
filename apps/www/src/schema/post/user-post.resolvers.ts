import { Post } from "@umamin-global/db/dist/generated/type-graphql";
import type { TContext } from "@/app/api/graphql/_types";
import { PostsWithCursor, UserPostsArgs } from "./post.types";
import { Resolver, Query, Ctx, Directive, Args } from "type-graphql";

@Resolver(() => Post)
export class UserPostResolver {
  @Query(() => PostsWithCursor)
  @Directive("@cacheControl(maxAge: 60)")
  async getUserPosts(
    @Ctx() ctx: TContext,
    @Args() { isComment, authorId, cursorId }: UserPostsArgs,
  ): Promise<PostsWithCursor> {
    try {
      const posts = await ctx.prisma.post.findMany({
        where: {
          parentId: isComment ? { not: null } : null,
          authorId: authorId,
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
        ...(cursorId && {
          skip: 1,
          cursor: {
            id: cursorId,
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
