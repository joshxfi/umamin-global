import { GetLatestPostsQuery } from "@umamin-global/codegen/generated/graphql";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export type PostData = Omit<
  NonNullable<Required<GetLatestPostsQuery["getPosts"]["data"]>>[0],
  "__typename"
>;
