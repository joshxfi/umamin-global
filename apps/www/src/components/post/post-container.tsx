"use client";

import { useSession } from "next-auth/react";
import React, { useMemo } from "react";

import { Post } from "./post";
import { usePostStore } from "@/store/usePostStore";
import { PostWithComments } from "@umamin-global/codegen/__generated__/graphql";

export function PostContainer({
  showComments = false,
  ...props
}: { showComments?: boolean } & PostWithComments) {
  const { data: session } = useSession();
  const isUserAuthor = props.author.id === session?.user?.id;
  const _tempComments = usePostStore((state) => state.comments);

  const tempComments = useMemo(
    () =>
      _tempComments[props.id]
        ? Object.entries(_tempComments[props.id]).map(([_, v]) => v)
        : [],
    [_tempComments, props.id],
  );

  return (
    <div className="pb-12">
      <Post
        {...props}
        type="post"
        isUserAuthor={isUserAuthor}
        upvoteCount={props.upvotes?.length}
      />

      {showComments && (
        <div>
          {props.comments?.map((comment) => (
            <Post
              key={comment.id}
              type="comment"
              {...comment}
              upvoteCount={comment.upvotes?.length}
              isAuthor={props.author.id === comment.author.id}
              isUserAuthor={isUserAuthor}
            />
          ))}

          {tempComments?.map((comment) => (
            <Post
              key={comment.id}
              type="comment"
              {...comment}
              isAuthor={props.author.id === comment.author.id}
              isUserAuthor={isUserAuthor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
