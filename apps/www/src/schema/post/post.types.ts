import { Post, User, Upvote, Tag } from "@umamin-global/db";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class Count {
  @Field()
  comments: number;
}

@ObjectType()
export class PostData {
  @Field(() => User)
  author: User;

  @Field(() => [Upvote], { nullable: true })
  upvotes?: Upvote[];

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  content: string;

  @Field()
  isAnonymous: boolean;

  @Field()
  authorId: string;

  @Field(() => ID, { nullable: true })
  parentId?: string | null;

  @Field(() => Post, { nullable: true })
  parent?: Post | null;

  @Field(() => Count, { nullable: true })
  _count?: Count | null;
}

@ObjectType()
export class PostsWithCursor {
  @Field(() => [PostData])
  data: PostData[];

  @Field(() => ID, { nullable: true })
  cursorId?: string;
}
