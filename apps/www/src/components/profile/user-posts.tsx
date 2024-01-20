import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { usePostStore } from "@/store/usePostStore";
import { PostContainer } from "../post/post-container";

type Props = {
  isComment?: boolean;
  authorId: string;
};

const GET_USER_POSTS = gql(`
query GetUserPosts($cursorId: ID, $authorId: String!, $isComment: Boolean!) {
  getUserPosts(
    cursorId: $cursorId
    authorId: $authorId
    isComment: $isComment
  ) {
    cursorId
    data {
      id
      content
      createdAt
      isAnonymous
      author {
        id
        username
      }
      tags {
        id
        name
      }
      upvotes {
        id
        userId
      }
      comments {
        id
        content
        createdAt
        isAnonymous
        author {
          id
          username
        }
        upvotes {
          id
          userId
        }
      }
    }
  }
}
`);

export function UserPosts({ isComment = false, authorId }: Props) {
  const { ref, inView } = useInView();
  const removedPosts = usePostStore((state) => state.removedPosts);
  const { data, fetchMore } = useQuery(GET_USER_POSTS, {
    variables: {
      isComment,
      authorId,
    },
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
  }, [inView, fetchMore, data?.getUserPosts.cursorId]);

  return (
    <section className="pb-24 pt-12">
      {data?.getUserPosts.data
        ?.filter((m) => !removedPosts.includes(m.id))
        .map((m) => <PostContainer key={m.id} {...m} />)}

      {!!data?.getUserPosts.data && data.getUserPosts.data.length >= 10 && (
        <div ref={ref}></div>
      )}
    </section>
  );
}
