import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { formatDistanceToNowStrict, formatRelative } from "date-fns";

import { formatDistance } from "@/hooks/format-distance";

import { cn } from "@/lib/utils";
import type { PostData } from "@/types";
import { useNanoid } from "@/hooks/use-nanoid";
import { usePostStore } from "@/store/usePostStore";
import { Role } from "@umamin-global/codegen/__generated__/graphql";

import { Icons } from "../icons";
import { Badge } from "../ui/badge";
import { ContentMod } from "../moderator/mod-dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { PostDropdownMenu } from "./post-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  additionalTags?: React.ReactNode;
  postButtons?: React.ReactNode;
} & Omit<PostData, "comments">;

export function PostContent({ additionalTags, postButtons, ...rest }: Props) {
  const [modDialog, setModDialog] = useState(false);
  const _tempTags = usePostStore((state) => state.tags);
  const tempTags = useMemo(
    () =>
      _tempTags[rest.id]
        ? Object.entries(_tempTags[rest.id]).map(([k, v]) => ({
            name: k,
            hide: v,
          }))
        : [],
    [_tempTags, rest.id]
  );
  const { data: session } = useSession();

  const tagsToDisplay = useMemo(
    () => [
      ...(rest.tags
        ?.filter((t) => !tempTags.some((_t) => t.name === _t.name && _t.hide))
        .map((t) => t.name) ?? []),
      ...tempTags?.filter((t) => !t.hide).map((t) => t.name),
    ],
    [rest.tags, tempTags]
  );

  const ids = useNanoid(tagsToDisplay.length);

  const [hideNsfw, setHideNsfw] = useState(true);

  return (
    <div className="flex gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage
          className="rounded-full"
          src={rest.author.image as string | undefined}
          alt={`${rest.author.username}'s avatar`}
        />
        <AvatarFallback className="text-xs">
          {rest.author.username?.split(" ").at(0)}
        </AvatarFallback>
      </Avatar>
      <div className="w-full ">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            <h2 className="font-semibold text-base">
              {rest.isAnonymous ? (
                <span className="text-zinc-400">hidden</span>
              ) : (
                rest.author.username
              )}
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="select-none text-muted-foreground">
                    {formatDistanceToNowStrict(rest.createdAt, {
                      addSuffix: false,
                      locale: {
                        formatDistance: (...props) => formatDistance(...props),
                      },
                    })}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{formatRelative(rest.createdAt, new Date())}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {session?.user?.role === Role.Moderator && (
            <>
              <button type="button" onClick={() => setModDialog(true)}>
                <Icons.exclamation className="w-4 h-4" />
              </button>

              <ContentMod
                open={modDialog}
                setOpen={setModDialog}
                existingTags={tagsToDisplay}
                {...rest}
              />
            </>
          )}

          <PostDropdownMenu postId={rest.id} postAuthor={rest.author.id} />
        </div>
        <div className="relative">
          <Link href={`/post/${rest.id}`}>
            <p
              className={cn(
                "break-words whitespace-pre-wrap relative text-base",
                {
                  "blur-sm text-gray-600 select-none":
                    tagsToDisplay.includes("quarantine") ||
                    (tagsToDisplay.includes("nsfw") && hideNsfw),
                }
              )}
            >
              {rest.content}
            </p>
          </Link>
          {tagsToDisplay.includes("nsfw") &&
            !tagsToDisplay.includes("quarantine") &&
            hideNsfw && (
              <button
                type="button"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                onClick={() => setHideNsfw(false)}
              >
                <Icons.exclamationCircle className="w-5 h-5 text-red-500" />
                <p className="font-semibold mt-2">NSFW Content</p>
                <p className="text-xs mt-1">Tap to view</p>
              </button>
            )}
        </div>

        {(additionalTags || tagsToDisplay.length > 0) && (
          <div className="flex gap-2 flex-wrap mt-2">
            {additionalTags}
            {tagsToDisplay.map((tag, i) => (
              <Badge key={ids[i]} name={tag} />
            ))}
          </div>
        )}

        {/* Upvote & Reply Buttons */}
        {postButtons}
      </div>
    </div>
  );
}
