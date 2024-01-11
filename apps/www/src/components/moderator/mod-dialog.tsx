import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { PostData } from "@/types";
import { gql } from "@tf/codegen/__generated__";
import { usePostStore } from "@/store/usePostStore";

import { ModTags } from "./mod-tags";
import { useToast } from "../ui/use-toast";
import { ConfirmButton } from "../confirm-button";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  existingTags: string[];
} & Omit<PostData, "comments">;

const REMOVE_POST = gql(`
mutation RemovePost($postId: ID!) {
  removePost(postId: $postId)
}
`);

export function ContentMod({ open, setOpen, existingTags, ...rest }: Props) {
  const { data: session } = useSession();
  const hasAccess =
    process.env.NEXT_PUBLIC_ALLOW_ACCESS === session?.user?.username;

  const [removePost, { loading }] = useMutation(REMOVE_POST, {
    variables: {
      postId: rest.id,
    },
  });

  const { toast } = useToast();
  const tempRemovePost = usePostStore((state) => state.removePost);

  const handleRemovePost = () => {
    toast({
      title: "Deleting Post",
      description: "Please wait",
    });

    removePost({
      onCompleted: () => {
        tempRemovePost(rest.id);
        toast({
          title: "Success",
          description: "Post removed permanently",
        });
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader className="text-left border-b border-muted pb-4">
            <p className="font-medium leading-none">Content Moderation</p>
            <p className="text-muted-foreground text-sm leading-none">
              Manage tags on this post
            </p>
          </DialogHeader>

          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-x-2">
              <h2 className="font-semibold">
                {rest.isAnonymous ? (
                  <span className="text-zinc-400">hidden</span>
                ) : (
                  rest.author.username
                )}
              </h2>
              <p className="text-muted-foreground">
                {formatDistanceToNow(new Date(rest.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <p className="break-words whitespace-pre-wrap text-sm">
            {rest.content}
          </p>

          <ModTags
            postId={rest.id}
            existingTags={existingTags}
            setOpen={setOpen}
            {...rest}
          />

          {hasAccess && (
            <ConfirmButton
              onConfirm={handleRemovePost}
              title="Delete Post"
              body="Are you sure you want to remove this post permanently?"
            >
              <button
                disabled={loading}
                type="button"
                className="text-red-600 text-right text-sm hover:underline disabled:text-muted-foreground disabled:hover:no-underline"
              >
                Delete Post
              </button>
            </ConfirmButton>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
