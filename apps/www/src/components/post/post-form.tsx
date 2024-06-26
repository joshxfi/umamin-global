import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@umamin-global/codegen";

import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { usePostStore } from "@/store/usePostStore";
import { Textarea } from "@/components/ui/textarea";

import { Badge } from "../ui/badge";
import { TagDialog } from "./tag-dialog";
import { toast } from "sonner";

const ADD_MESSAGE = gql(`
mutation AddPost($isAnonymous: Boolean!, $content: String!) {
  addPost(isAnonymous: $isAnonymous, content: $content) {
    id
    content
    createdAt
    isAnonymous
    author {
      id
      image
      username
    }
  }
}
`);

const ADD_TAG_TO_POST = gql(`
mutation AddTagToPost($postId: ID!, $tagName: String!) {
  addTagToPost(postId: $postId, tagName: $tagName) {
    id
    name
  }
}
`);

export function PostForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [submitMessage, { loading: submitLoading }] = useMutation(ADD_MESSAGE);
  const [addTagToPost] = useMutation(ADD_TAG_TO_POST);

  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const updateTempPosts = usePostStore((state) => state.addPost);
  const updateTempTags = usePostStore((state) => state.updateTags);

  const { data: session, status } = useSession();
  const { push } = useRouter();

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    submitMessage({
      variables: { content: content.trim(), isAnonymous },
      onCompleted: (data) => {
        setContent("");
        setOpen(false);
        setIsAnonymous(false);
        if (!!selectedTag) {
          addTagToPost({
            variables: {
              postId: data.addPost.id,
              tagName: selectedTag,
            },
            onCompleted: (tagData) => {
              updateTempTags(data.addPost.id, {
                name: tagData.addTagToPost.name,
                hide: false,
              });
            },
          });
        }

        updateTempPosts(data.addPost);

        toast.success("Your message has been posted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (status === "unauthenticated") {
    push("/login");
  }

  if (status === "loading") {
    return (
      <div className="grid place-items-center py-24">
        <Icons.spinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="pt-8 md:p-2">
      <div className="flex flex-col gap-y-3">
        <div className="flex items-end justify-between text-sm">
          <div className="flex space-x-2">
            <h2
              className={`${
                isAnonymous && "text-muted-foreground"
              } font-semibold`}
            >
              {isAnonymous ? "hidden" : session?.user.username}
            </h2>

            <div className="flex space-x-1">
              <Badge name="you" />
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag("")}
                  disabled={submitLoading}
                >
                  <Badge name={selectedTag} withRemove />
                </button>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">{content.length}/500</p>
        </div>

        <Textarea
          required
          maxLength={500}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitLoading}
          placeholder="Type your message here"
          className="max-h-[300px] min-h-[150px]"
        />

        <div className="flex items-center justify-between border-b border-muted pt-3 pb-6">
          <Label
            htmlFor="hide-username"
            className="font-normal text-muted-foreground flex space-x-2 items-center"
          >
            <Icons.hide className="w-5 h-5" />
            <p>Hide username</p>
          </Label>

          <Switch
            checked={isAnonymous}
            onClick={() => setIsAnonymous((prev) => !prev)}
            id="hide-username"
          />
        </div>

        <div className="flex justify-between items-center mt-3">
          {submitLoading && <Icons.spinner className="w-8 h-8" />}
          <div className="space-x-2 flex justify-end w-full">
            <Button
              type="button"
              variant="outline"
              disabled={submitLoading}
              onClick={() => setShowDialog(true)}
            >
              Add tag
            </Button>

            <Button
              type="submit"
              disabled={submitLoading || content.length === 0}
            >
              Post
            </Button>
          </div>
        </div>
      </div>

      <TagDialog
        open={showDialog}
        setOpen={setShowDialog}
        setSelectedTag={setSelectedTag}
      />
    </form>
  );
}
