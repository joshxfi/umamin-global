"use client";

import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@ummx/codegen/__generated__";

import { PostData } from "@/types";
import { Button } from "@/components/ui/button";
import { usePostStore } from "@/store/usePostStore";

import { Post } from "./post";
import { Icons } from "../icons";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { PostContent } from "./post-content";
import { DialogDrawer } from "../dialog-drawer";

const ADD_COMMENT = gql(`
mutation AddComment($postId: ID!, $isAnonymous: Boolean!, $content: String!) {
  addComment(postId: $postId, isAnonymous: $isAnonymous, content: $content) {
    id
    content
    createdAt
    isAnonymous
    author {
      id
      username
    }
  }
}
`);

export function PostContainer({ ...props }: PostData) {
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [addComment, { loading }] = useMutation(ADD_COMMENT);
  const isUserAuthor = props.author.id === session?.user?.id;

  const _tempComments = usePostStore((state) => state.comments);
  const updateTempComments = usePostStore((state) => state.updateComments);

  const tempComments = useMemo(
    () =>
      _tempComments[props.id]
        ? Object.entries(_tempComments[props.id]).map(([_, v]) => v)
        : [],
    [_tempComments, props.id]
  );

  const handleComment: React.FormEventHandler = (e) => {
    e.preventDefault();

    addComment({
      variables: {
        content: comment,
        isAnonymous: isUserAuthor
          ? props.isAnonymous
            ? true
            : false
          : isAnonymous,
        postId: props.id,
      },
      onCompleted: (data) => {
        toast({
          title: "Success",
          description: "Your comment has been added",
        });
        setComment("");
        updateTempComments(props.id, data?.addComment);
        setShowDialog(false);
      },
      onError: (err) => {
        console.log(err);

        toast({
          title: "Error",
          description: "Something went wrong",
        });
      },
    });
  };

  return (
    <div className="pb-8">
      <Post
        {...props}
        type="post"
        isUserAuthor={isUserAuthor}
        commentCount={(props.comments?.length ?? 0) + tempComments.length}
        upvoteCount={props.upvotes?.length}
        setShowComments={setShowComments}
      />

      {showComments && (
        <div className="mt-4">
          <div className="container">
            <button
              onClick={() => {
                if (status === "unauthenticated") {
                  toast({
                    title: "Oops!",
                    description: "You are not logged in",
                  });

                  return;
                }

                setShowDialog(true);
              }}
              type="button"
              className="rounded-full w-full px-5 py-3 bg-muted text-sm text-left text-muted-foreground"
            >
              Add a comment to{" "}
              {props.isAnonymous ? "user" : props.author.username}
            </button>
          </div>

          <DialogDrawer open={showDialog} setOpen={setShowDialog}>
            <section className="text-sm p-4 md:p-2 space-y-2">
              <PostContent
                {...props}
                additionalTags={isUserAuthor && <Badge name="you" />}
              />

              <form onSubmit={handleComment} className="pt-2">
                <Textarea
                  required
                  maxLength={500}
                  value={comment}
                  disabled={loading}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your comment here"
                  className="max-h-[300px] min-h-[150px]"
                />

                <Button
                  type="submit"
                  disabled={loading || comment.length === 0}
                  className="w-full mt-4"
                >
                  Comment
                </Button>
              </form>

              <div className="flex items-center justify-between h-8">
                {isUserAuthor ? (
                  <p className="text-muted-foreground italic text-xs">
                    Username will be {props.isAnonymous ? "hidden" : "shown"}
                  </p>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isAnonymous}
                      onClick={() => setIsAnonymous((prev) => !prev)}
                      id="hide-username"
                    />
                    <Label htmlFor="hide-username">Hide Username</Label>
                  </div>
                )}

                {loading && <Icons.spinner className="w-8 h-8" />}
              </div>
            </section>
          </DialogDrawer>

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
