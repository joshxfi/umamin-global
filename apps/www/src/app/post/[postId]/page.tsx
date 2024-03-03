"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { gql } from "@umamin-global/codegen/generated";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Post } from "@/components/post/post";
import { usePostStore } from "@/store/usePostStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";

const AdSense = dynamic(() => import("@/components/adsense"), {
  ssr: false,
});

const GET_POST = gql(`
query GetPost($postId: ID!) {
  getPost(postId: $postId) {
    id
    content
    createdAt
    isAnonymous
    author {
      id
      image
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
  }
}
`);

const GET_COMMENTS = gql(`
query GetComments($cursorId: ID, $parentId: ID) {
  getPosts(cursorId: $cursorId, parentId: $parentId) {
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
    }
  }
}
`);

export default function SinglePost({ params }: { params: { postId: string } }) {
  const { ref, inView } = useInView();
  const { data, loading } = useQuery(GET_POST, {
    variables: {
      postId: params.postId,
    },
  });

  const {
    data: commentsData,
    loading: commentsLoading,
    fetchMore,
  } = useQuery(GET_COMMENTS, {
    variables: {
      parentId: params.postId,
    },
  });

  const _tempComments = usePostStore((state) => state.comments);

  const tempComments = useMemo(
    () =>
      _tempComments[data?.getPost.id ?? ""]
        ? Object.entries(_tempComments[data?.getPost.id ?? ""]).map(
            ([_, v]) => v,
          )
        : [],
    [_tempComments, data?.getPost.id],
  );

  useEffect(() => {
    if (inView && commentsData && commentsData.getPosts.cursorId) {
      fetchMore({
        variables: {
          parentId: params.postId,
          cursorId: commentsData?.getPosts.cursorId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (loading || commentsLoading) {
    return (
      <div className="space-y-12 container">
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="pb-12">
      <Post {...data.getPost} type="post" />

      {/* umg-feed */}
      <AdSense slotId="6296403271" />

      <div>
        {commentsData?.getPosts.data.map((comment, i) => (
          <div key={comment.id}>
            {/* umg-posts */}
            {(i + 1) % 5 === 0 && <AdSense slotId="1301793554" />}

            <Post
              type="comment"
              {...comment}
              isAuthor={data.getPost.author.id === comment.author.id}
            />
          </div>
        ))}

        {tempComments?.map((comment) => (
          <Post
            key={comment.id}
            type="comment"
            {...comment}
            isAuthor={data.getPost.author.id === comment.author.id}
          />
        ))}

        {!!commentsData?.getPosts.data &&
          commentsData.getPosts.data.length >= 10 && <div ref={ref}></div>}
      </div>
    </div>
  );
}
