import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@umamin-global/codegen/__generated__";

import { PostData } from "@/types";
import { Button } from "@/components/ui/button";
import { usePostStore } from "@/store/usePostStore";

import { Icons } from "../icons";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { PostContent } from "./post-content";
import { DialogDrawer } from "../dialog-drawer";

type Props = {
  type: "post" | "comment";
  isAuthor?: boolean;
  isUserAuthor?: boolean;
  upvoteCount?: number;
  commentCount?: number;
};

const ADD_UPVOTE = gql(`
mutation AddUpvote($postId: ID!) {
  addUpvote(postId: $postId) {
    id
  }
}
`);

const REMOVE_UPVOTE = gql(`
mutation RemoveUpvote($upvoteId: ID!) {
  removeUpvote(id: $upvoteId) 
}
`);

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

export const Post = ({
  type,
  isAuthor,
  isUserAuthor,
  commentCount = 0,
  upvoteCount = 0,
  ...props
}: Props & Omit<PostData, "comments">) => {
  const [addUpvote, { loading: addUpvoteLoading }] = useMutation(ADD_UPVOTE);
  const [removeUpvote, { loading: removeUpvoteLoading }] =
    useMutation(REMOVE_UPVOTE);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [addComment, { loading }] = useMutation(ADD_COMMENT);
  const [commentDialog, setCommentDialog] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [comment, setComment] = useState("");
  const updateTempComments = usePostStore((state) => state.updateComments);

  const tempUpvote = usePostStore((state) => state.upvotes[props.id]);
  const isTempUpvoted = tempUpvote && tempUpvote !== "temp";
  const updateTempUpvotes = usePostStore((state) => state.updateUpvotes);

  const isUpvoted = useMemo(
    () => props.upvotes?.some((u) => u.userId === session?.user?.id),
    [props.upvotes, session?.user],
  );

  const upvoteId = useMemo(
    () =>
      tempUpvote ??
      props.upvotes?.find((u) => u.userId === session?.user?.id)?.id,
    [tempUpvote, props.upvotes, session?.user],
  );

  const displayUpvoteCount = useMemo(() => {
    if (!!tempUpvote) {
      if (isUpvoted) return !isTempUpvoted ? upvoteCount - 1 : upvoteCount;
      return isTempUpvoted ? upvoteCount + 1 : upvoteCount;
    } else {
      return upvoteCount;
    }
  }, [isTempUpvoted, isUpvoted, upvoteCount, tempUpvote]);

  const handleAddUpvote = (postId: string) => {
    if (status === "unauthenticated") {
      toast({
        title: "Oops!",
        description: "You are not logged in",
      });

      return;
    }

    if (isUserAuthor) {
      toast({
        title: "Oops!",
        description: "You can't upvote your own post",
      });

      return;
    }
    addUpvote({
      variables: {
        postId,
      },
      onCompleted: (data) => {
        toast({
          title: "Success",
          description: "Upvoted successfully",
        });

        updateTempUpvotes(props.id, data.addUpvote.id);
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

  const handleRemoveUpvote = () => {
    if (!upvoteId) {
      toast({
        title: "Oops!",
        description: "Something went wrong",
      });

      return;
    }

    removeUpvote({
      variables: {
        upvoteId,
      },
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Upvote removed",
        });

        updateTempUpvotes(props.id, "temp");
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

        setCommentDialog(false);
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
    <div className="border-b border-muted pb-8 text-sm">
      <div className={`${type === "comment" && "pl-16 pt-8"} container`}>
        <PostContent
          {...props}
          additionalTags={
            <>
              {type === "comment" && isAuthor && <Badge name="author" />}
              {isUserAuthor && <Badge name="you" />}
            </>
          }
        />

        <div className="mt-4 flex gap-x-2 items-center">
          {!!isTempUpvoted || (isUpvoted && !tempUpvote) ? (
            <button
              type="button"
              disabled={removeUpvoteLoading}
              onClick={handleRemoveUpvote}
            >
              <Icons.arrowUpSolid className="w-6 h-6" />
            </button>
          ) : (
            <button
              type="button"
              disabled={addUpvoteLoading}
              onClick={() => handleAddUpvote(props.id)}
            >
              <Icons.arrowUp className="w-6 h-6" />
            </button>
          )}

          <button type="button" onClick={() => setCommentDialog(true)}>
            <Icons.reply className="w-6 h-6" />
          </button>
        </div>

        <div className="flex space-x-2 text-muted-foreground font-light mt-3">
          {commentCount > 0 && (
            <>
              <Link href={`/post/${props.id}`}>
                {commentCount} comment{commentCount > 1 && "s"}
              </Link>
              {displayUpvoteCount > 0 && <p>&#183;</p>}
            </>
          )}

          {displayUpvoteCount > 0 && (
            <p>
              {displayUpvoteCount} upvote{displayUpvoteCount > 1 && "s"}
            </p>
          )}
        </div>
      </div>

      <DialogDrawer open={commentDialog} setOpen={setCommentDialog}>
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
    </div>
  );
};
