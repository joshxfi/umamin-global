import { Post, Upvote } from "@umamin-global/db";
import type { TContext } from "@/app/api/graphql/_types";
import { PostData, PostsWithCursor } from "./post.types";
import {
  Resolver,
  Query,
  Ctx,
  Mutation,
  Arg,
  ID,
  Directive,
} from "type-graphql";
import { nanoid } from "nanoid";

@Resolver(() => Post)
export class PostResolver {
  @Query(() => PostsWithCursor)
  @Directive("@cacheControl(maxAge: 60)")
  async getPosts(
    @Ctx() ctx: TContext,
    @Arg("parentId", () => ID, { nullable: true }) parentId?: string | null,
    @Arg("cursorId", () => ID, { nullable: true }) cursorId?: string | null,
  ): Promise<PostsWithCursor> {
    try {
      const posts = await ctx.prisma.post.findMany({
        where: {
          parentId: parentId ?? null,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          author: true,
          tags: true,
          upvotes: true,
          ...(!parentId && {
            _count: {
              select: {
                comments: true,
              },
            },
          }),
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

  @Query(() => PostsWithCursor)
  @Directive("@cacheControl(maxAge: 60)")
  async getTopPosts(
    @Ctx() ctx: TContext,
    @Arg("cursorId", () => ID, { nullable: true }) cursorId?: string | null,
  ): Promise<PostsWithCursor> {
    try {
      const posts = await ctx.prisma.post.findMany({
        where: {
          parentId: null,
        },
        orderBy: {
          upvotes: {
            _count: "desc",
          },
        },
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

  @Query(() => PostData)
  @Directive("@cacheControl(maxAge: 60)")
  async getPost(
    @Arg("postId", () => ID) postId: string,
    @Ctx() ctx: TContext,
  ): Promise<PostData> {
    try {
      return await ctx.prisma.post.findUniqueOrThrow({
        where: { id: postId },
        include: {
          author: true,
          tags: true,
          upvotes: true,
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => PostData)
  @Directive("@cacheControl(maxAge: 60)")
  async addPost(
    @Arg("content", () => String) content: string,
    @Arg("isAnonymous", () => Boolean) isAnonymous: boolean,
    @Ctx() ctx: TContext,
  ): Promise<PostData> {
    try {
      return await ctx.prisma.post.create({
        data: {
          id: nanoid(11),
          content,
          isAnonymous,
          author: { connect: { id: ctx.id } },
        },
        include: { author: true },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => PostData)
  @Directive("@cacheControl(maxAge: 60)")
  async addComment(
    @Arg("content", () => String) content: string,
    @Arg("isAnonymous", () => Boolean) isAnonymous: boolean,
    @Arg("postId", () => ID) postId: string,
    @Ctx() ctx: TContext,
  ): Promise<PostData> {
    try {
      const commentData = await ctx.prisma.post.create({
        data: {
          id: nanoid(11),
          content,
          isAnonymous,
          author: { connect: { id: ctx.id } },
          parent: { connect: { id: postId } },
        },
        include: {
          author: true,
        },
      });

      return commentData;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => String)
  @Directive("@cacheControl(maxAge: 60)")
  async removePost(
    @Arg("postId", () => ID) postId: string,
    @Ctx() ctx: TContext,
  ): Promise<String> {
    try {
      const post = await ctx.prisma.post.findUnique({
        where: { id: postId },
        include: { comments: true },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.comments.length > 0) {
        await ctx.prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            comments: {
              deleteMany: {},
            },
          },
        });
      }

      await ctx.prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return "Success";
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => Upvote)
  @Directive("@cacheControl(maxAge: 60)")
  async addUpvote(
    @Arg("postId", () => ID) postId: string,
    @Ctx() ctx: TContext,
  ): Promise<Upvote> {
    try {
      return await ctx.prisma.upvote.create({
        data: {
          userId: ctx.id ?? "",
          post: { connect: { id: postId } },
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @Mutation(() => String)
  @Directive("@cacheControl(maxAge: 60)")
  async removeUpvote(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: TContext,
  ): Promise<String> {
    try {
      await ctx.prisma.upvote.delete({
        where: {
          id,
        },
      });

      return "Success";
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
