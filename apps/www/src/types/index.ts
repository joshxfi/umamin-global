import { GetPostsQuery } from "@ummx/codegen/__generated__/graphql";

export type PostData = Omit<NonNullable<Required<GetPostsQuery["getPosts"]["data"]>>[0], '__typename'>
