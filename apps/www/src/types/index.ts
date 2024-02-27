import { GetPostsQuery } from "@umamin-global/codegen/generated/graphql";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export type PostData = Omit<NonNullable<Required<GetPostsQuery["getPosts"]["data"]>>[0], '__typename'>
