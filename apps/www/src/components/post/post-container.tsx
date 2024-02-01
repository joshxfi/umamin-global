"use client";

import React, { useMemo } from "react";

import { Post } from "./post";
import { usePostStore } from "@/store/usePostStore";
import { GetPostQuery } from "@umamin-global/codegen/__generated__/graphql";

export function PostContainer({
  showComments = false,
  ...props
}: { showComments?: boolean } & GetPostQuery["getPost"]) {
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
      <Post {...props} type="post" />

      {showComments && (
        <div>
          {props.comments?.map((comment) => (
            <Post
              key={comment.id}
              type="comment"
              {...comment}
              isAuthor={props.author.id === comment.author.id}
            />
          ))}

          {tempComments?.map((comment) => (
            <Post
              key={comment.id}
              type="comment"
              {...comment}
              isAuthor={props.author.id === comment.author.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
