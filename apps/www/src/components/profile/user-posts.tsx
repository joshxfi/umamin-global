import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Post } from "../post/post";
import { usePostStore } from "@/store/usePostStore";

type Props = {
  isComment?: boolean;
  authorId: string;
};

const GET_USER_POSTS = gql(`
query GetUserPosts($cursorId: ID, $authorId: String, $isComment: Boolean) {
  getPosts(cursorId: $cursorId, authorId: $authorId, isComment: $isComment) {
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
  const { data, fetchMore } = useQuery(GET_USER_POSTS, {
    variables: {
      isComment,
      authorId,
    },
    skip: !authorId,
  });

  useEffect(() => {
    if (inView) {
      fetchMore({
        variables: {
          cursorId: data?.getPosts.cursorId,
          isComment,
          authorId,
        },
      });
    }
  }, [inView, fetchMore, data?.getPosts.cursorId, authorId, isComment]);

  return (
    <section className="pb-24 pt-12">
      {data?.getPosts.data
        ?.filter((m) => !removedPosts.includes(m.id))
        ?.filter((m) => !(authorId !== session?.user.id && m.isAnonymous))
        .map((m) => <Post type="post" key={m.id} {...m} />)}

      {!!data?.getPosts.data && data.getPosts.data.length >= 10 && (
        <div ref={ref}></div>
      )}
    </section>
  );
}
