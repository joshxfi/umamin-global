import { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ConfirmButton } from "@/components/confirm-button";
import { toast } from "sonner";

const GET_TAGS = gql(`
query GetTags {
  getTags {
    id
    name
  }
}
`);

const ADD_TAG = gql(`
mutation AddTag($name: String!) {
  addTag(name: $name) {
    id
    name
  }
}
`);

const REMOVE_TAG = gql(`
mutation RemoveTag($tagId: ID!) {
  removeTag(id: $tagId)
}
`);

export function ManageTags() {
  const { data, refetch } = useQuery(GET_TAGS);
  const [addTag, { loading: addTagLoading }] = useMutation(ADD_TAG);
  const [removeTag, { loading: removeTagLoading }] = useMutation(REMOVE_TAG);

  const [tagName, setTagName] = useState("");

  const handleAddTag = () => {
    addTag({
      variables: {
        name: tagName,
      },
      onCompleted: () => {
        setTagName("");
        refetch();
        toast.success(`Added ${tagName} tag`);
      },
      onError: (err) => {
        console.log(err);

        toast.error("Something went wrong");
      },
    });
  };

  const handleRemoveTag = (tagId: string) => {
    removeTag({
      variables: {
        tagId,
      },
      onCompleted: () => {
        refetch();
        toast.success("Tag removed");
      },
    });
  };

  return (
    <div className="border-b border-muted pb-24">
      <h1 className="text-2xl font-medium">Available Tags</h1>
      <p className="text-muted-foreground text-sm">Click on a tag to remove</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {!data?.getTags.length && <Badge name="none" />}
        {data?.getTags.map((tag) => (
          <ConfirmButton
            key={tag.id}
            title="Remove tag"
            body={`Are you sure you want to remove the tag "${tag.name}"?`}
            onConfirm={() => handleRemoveTag(tag.id)}
          >
            <button disabled={removeTagLoading}>
              <Badge name={tag.name} />
            </button>
          </ConfirmButton>
        ))}
      </div>

      <div className="space-y-4 mt-12">
        <div className="grid gap-2">
          <Label htmlFor="password">Add a new tag</Label>
          <Input
            value={tagName}
            disabled={addTagLoading}
            onChange={(e) => setTagName(e.target.value)}
            className="max-w-[300px]"
            placeholder="Enter tag name"
          />
        </div>
        <ConfirmButton
          title="Add Tag"
          body={`Are you sure you want to add the tag "${tagName}"?`}
          onConfirm={handleAddTag}
        >
          <Button disabled={!tagName || addTagLoading}>Proceed</Button>
        </ConfirmButton>
      </div>
    </div>
  );
}
