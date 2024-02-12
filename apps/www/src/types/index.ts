import { GetPostsQuery } from "@umamin-global/codegen/__generated__/graphql";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export type PostData = Omit<NonNullable<Required<GetPostsQuery["getPosts"]["data"]>>[0], '__typename'>
