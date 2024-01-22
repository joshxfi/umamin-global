import { gql } from "@umamin-global/codegen/__generated__/";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useNanoid } from "@/hooks/use-nanoid";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>;
};

const GET_TAGS = gql(`
query GetTags {
  getTags {
    id
    name
  }
}
`);

export function TagDialog({ open, setOpen, setSelectedTag }: Props) {
  const { data, loading } = useQuery(GET_TAGS);
  const ids = useNanoid(4);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader className="text-left">
          <p className="font-medium leading-none">Tags</p>
          <p className="text-muted-foreground text-sm leading-none">
            Select a tag that applies to your post
          </p>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mt-2">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={ids[i]} className="h-4 w-[70px]" />
            ))}

          {data?.getTags
            .filter((t) => !["quarantine", "nsfw"].includes(t.name))
            .map(({ id, name }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSelectedTag(name);
                  setOpen(false);
                }}
              >
                <Badge name={name} />
              </button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
