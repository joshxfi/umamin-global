"use client";

import { useSession } from "next-auth/react";
import React, { useMemo } from "react";

import { Post } from "./post";
import type { PostData } from "@/types";
import { usePostStore } from "@/store/usePostStore";

export function PostContainer({
  showComments = false,
  ...props
}: { showComments?: boolean } & PostData) {
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
    <div className="pb-8">
      <Post
        {...props}
        type="post"
        isUserAuthor={isUserAuthor}
        commentCount={(props.comments?.length ?? 0) + tempComments.length}
        upvoteCount={props.upvotes?.length}
      />

      {showComments && (
        <div className="mt-4">
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
