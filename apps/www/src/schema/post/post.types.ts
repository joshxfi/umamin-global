import { Post, User, Upvote, Tag } from "@generated/type-graphql";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PostData extends Post {
  @Field(() => User)
  author: User;

  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];
}

@ObjectType()
export class PostWithComments extends PostData {
  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => [PostData], { nullable: true })
  comments?: PostData[];
}

@ObjectType()
export class PostsWithCursor {
  @Field(() => [PostWithComments])
  data: PostWithComments[];

  @Field({ nullable: true })
  cursorId?: string;
}
