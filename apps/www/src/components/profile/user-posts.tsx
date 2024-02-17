import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Post } from "../post/post";
import { Skeleton } from "../ui/skeleton";
import { useNanoid } from "@/hooks/use-nanoid";
import { usePostStore } from "@/store/usePostStore";

type Props = {
  isComment?: boolean;
  authorId: string;
};

const GET_USER_POSTS = gql(`
query GetUserPosts($authorId: ID!, $cursorId: ID, $isComment: Boolean) {
  getUserPosts(authorId: $authorId, cursorId: $cursorId, isComment: $isComment) {
    cursorId
    data {
      id
      content
      createdAt
      isAnonymous
      author {
        id
        username
        image
      }
      tags {
        id
        name
      }
      upvotes {
        id
        userId
      }
      _count {
        comments
      }
    }
  }
}
`);

export function UserPosts({ isComment = false, authorId }: Props) {
  const { ref, inView } = useInView();
  const { data: session } = useSession();
  const removedPosts = usePostStore((state) => state.removedPosts);
  const { data, loading, fetchMore } = useQuery(GET_USER_POSTS, {
    variables: {
      authorId,
      isComment,
    },
    skip: !authorId,
  });

  useEffect(() => {
    if (inView) {
      fetchMore({
        variables: {
          cursorId: data?.getUserPosts.cursorId,
          isComment,
          authorId,
        },
      });
    }
  }, [inView, fetchMore, data?.getUserPosts.cursorId, authorId, isComment]);

  const ids = useNanoid(6);
  const userPosts = useMemo(
    () =>
      data?.getUserPosts.data
        ?.filter((m) => !removedPosts.includes(m.id))
        ?.filter((m) => !(authorId !== session?.user.id && m.isAnonymous)),
    [data?.getUserPosts.data, removedPosts, authorId, session?.user.id],
  );

  if (loading) {
    return (
      <div className="space-y-12 container py-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="space-y-2" key={ids[i]}>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-[300px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="pb-24">
      {userPosts?.length === 0 && (
        <p className="text-center mt-8 text-muted-foreground text-sm">
          No posts to show
        </p>
      )}
      {userPosts?.map((m) => <Post type="post" key={m.id} {...m} />)}
      {!!userPosts && userPosts.length >= 10 && <div ref={ref}></div>}
    </section>
  );
}
