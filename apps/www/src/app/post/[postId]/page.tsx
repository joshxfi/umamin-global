"use client";

import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@umamin-global/codegen/__generated__";

import { PostContainer } from "@/components/post/post-container";
import { Skeleton } from "@/components/ui/skeleton";

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
`);

export default function Post({ params }: { params: { postId: string } }) {
  const { data, loading } = useQuery(GET_POST, {
    variables: {
      postId: params.postId,
    },
  });

  if (loading) {
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
    <PostContainer
      showComments={true}
      key={data?.getPost.id}
      {...data?.getPost}
    />
  );
}
