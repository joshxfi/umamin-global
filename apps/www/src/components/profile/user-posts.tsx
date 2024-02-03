import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Post } from "../post/post";
import { usePostStore } from "@/store/usePostStore";

type Props = {
  isComment?: boolean;
  isUpvoted?: boolean;
  authorId: string;
};

const GET_USER_POSTS = gql(`
query GetUserPosts($input: UserPostsInput!) {
  getUserPosts(input: $input) {
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

export function UserPosts({
  isComment = false,
  isUpvoted = false,
  authorId,
}: Props) {
  const { ref, inView } = useInView();
  const { data: session } = useSession();
  const removedPosts = usePostStore((state) => state.removedPosts);
  const { data, fetchMore } = useQuery(GET_USER_POSTS, {
    variables: {
      input: {
        authorId,
        isComment,
        isUpvoted,
      },
    },
    skip: !authorId,
  });

  useEffect(() => {
    if (inView) {
      fetchMore({
        variables: {
          input: {
            cursorId: data?.getUserPosts.cursorId,
            isComment,
            isUpvoted,
            authorId,
          },
        },
      });
    }
  }, [
    inView,
    fetchMore,
    data?.getUserPosts.cursorId,
    authorId,
    isComment,
    isUpvoted,
  ]);

  return (
    <section className="pb-24 pt-12">
      {data?.getUserPosts.data
        ?.filter((m) => !removedPosts.includes(m.id))
        ?.filter((m) => !(authorId !== session?.user.id && m.isAnonymous))
        .map((m) => <Post type="post" key={m.id} {...m} />)}

      {!!data?.getUserPosts.data && data.getUserPosts.data.length >= 10 && (
        <div ref={ref}></div>
      )}
    </section>
  );
}
