import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@ummx/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { usePostStore } from "@/store/usePostStore";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { Badge } from "../ui/badge";
import { TagDialog } from "./tag-dialog";

const ADD_MESSAGE = gql(`
mutation AddPost($isAnonymous: Boolean!, $content: String!) {
  addPost(isAnonymous: $isAnonymous, content: $content) {
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

const GET_CURRENT_USER = gql(`
query GetCurrentUser {
  getCurrentUser {
    id
    username
    createdAt
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
  const { data, loading } = useQuery(GET_CURRENT_USER);
  const [submitMessage, { loading: submitLoading }] = useMutation(ADD_MESSAGE);
  const [addTagToPost] = useMutation(ADD_TAG_TO_POST);

  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const updateTempPosts = usePostStore((state) => state.addPost);
  const updateTempTags = usePostStore((state) => state.updateTags);

  const { toast } = useToast();
  const { status } = useSession();
  const { push } = useRouter();

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    submitMessage({
      variables: { content, isAnonymous },
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

        toast({
          title: "Success",
          description: "Your message has been posted",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
        });
      },
    });
  };

  if (status === "unauthenticated") {
    push("/login");
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <Icons.spinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-4 pt-8 md:p-2">
      <div className="flex flex-col gap-y-3">
        <div className="flex items-end justify-between text-sm">
          <div className="flex space-x-2">
            <h2
              className={`${
                isAnonymous && "text-muted-foreground"
              } font-semibold`}
            >
              {isAnonymous ? "hidden" : data?.getCurrentUser.username}
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
