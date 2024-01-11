import { useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@tf/codegen/__generated__";

import { PostData } from "@/types";
import { usePostStore } from "@/store/usePostStore";

import { Icons } from "../icons";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { PostContent } from "./post-content";

type Props = {
  type: "post" | "comment";
  isAuthor?: boolean;
  isUserAuthor?: boolean;
  upvoteCount?: number;
  commentCount?: number;
  setShowComments?: React.Dispatch<React.SetStateAction<boolean>>;
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

export const Post = ({
  type,
  isAuthor,
  isUserAuthor,
  commentCount,
  upvoteCount = 0,
  setShowComments,
  ...rest
}: Props & Omit<PostData, "comments">) => {
  const [addUpvote, { loading: addUpvoteLoading }] = useMutation(ADD_UPVOTE);
  const [removeUpvote, { loading: removeUpvoteLoading }] =
    useMutation(REMOVE_UPVOTE);
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const tempUpvote = usePostStore((state) => state.upvotes[rest.id]);
  const isTempUpvoted = tempUpvote && tempUpvote !== "temp";
  const updateTempUpvotes = usePostStore((state) => state.updateUpvotes);

  const isUpvoted = useMemo(
    () => rest.upvotes?.some((u) => u.userId === session?.user?.id),
    [rest.upvotes, session?.user]
  );

  const upvoteId = useMemo(
    () =>
      tempUpvote ??
      rest.upvotes?.find((u) => u.userId === session?.user?.id)?.id,
    [tempUpvote, rest.upvotes, session?.user]
  );

  const displayUpvoteCount = useCallback(() => {
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

        updateTempUpvotes(rest.id, data.addUpvote.id);
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

        updateTempUpvotes(rest.id, "temp");
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
    <div className="border-b border-muted pb-8 max-w-screen-sm mx-auto text-sm">
      <div className={`${type === "comment" && "pl-16 pt-8"} container`}>
        <PostContent
          {...rest}
          additionalTags={
            <>
              {type === "comment" && isAuthor && <Badge name="author" />}
              {isUserAuthor && <Badge name="you" />}
            </>
          }
        />

        <div className="mt-4 flex gap-x-2 items-center">
          <div className="flex gap-x-1 items-center">
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
                onClick={() => handleAddUpvote(rest.id)}
              >
                <Icons.arrowUp className="w-6 h-6" />
              </button>
            )}

            <p className="text-muted-foreground">{displayUpvoteCount()}</p>
          </div>

          {setShowComments && (
            <div className="flex gap-x-1 items-center">
              <button type="button" onClick={() => setShowComments((p) => !p)}>
                <Icons.reply className="w-6 h-6" />
              </button>

              <p className="text-muted-foreground">{commentCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
