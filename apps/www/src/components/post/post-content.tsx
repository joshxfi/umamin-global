import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { formatDistanceToNowStrict, formatRelative } from "date-fns";

import { cn } from "@/lib/utils";
import type { PostData } from "@/types";
import { useNanoid } from "@/hooks/use-nanoid";
import { usePostStore } from "@/store/usePostStore";
import { formatDistance } from "@/hooks/format-distance";
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
import { ProfileHoverCard } from "../profile/profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  type?: "post" | "comment";
  additionalTags?: React.ReactNode;
  postButtons?: React.ReactNode;
} & Omit<PostData, "comments">;

export function PostContent({
  type,
  additionalTags,
  postButtons,
  ...rest
}: Props) {
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
    [_tempTags, rest.id],
  );
  const { data: session } = useSession();

  const tagsToDisplay = useMemo(
    () => [
      ...(rest.tags
        ?.filter((t) => !tempTags.some((_t) => t.name === _t.name && _t.hide))
        .map((t) => t.name) ?? []),
      ...tempTags?.filter((t) => !t.hide).map((t) => t.name),
    ],
    [rest.tags, tempTags],
  );

  const ids = useNanoid(tagsToDisplay.length);
  const pathname = usePathname();

  return (
    <div className="flex gap-3 container">
      <Avatar className="h-9 w-9 mt-1">
        <AvatarImage
          className="rounded-full"
          src={rest.isAnonymous ? "" : rest.author.image ?? ""}
          alt="User Avatar"
        />
        <AvatarFallback className="text-xs uppercase">
          {rest.author.username?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="w-full ">
        <div className="flex justify-between items-center">
          <div className="flex gap-x-2">
            {rest.isAnonymous ? (
              <p className="font-semibold text-sm text-zinc-400">hidden</p>
            ) : (
              <ProfileHoverCard author={rest.author} userId={session?.user.id}>
                <Link
                  href={`/user/${rest.author.username}`}
                  className="font-semibold text-sm hover:underline"
                >
                  {rest.author.username}
                </Link>
              </ProfileHoverCard>
            )}
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

        {pathname !== "/" ? (
          <p
            className={cn("break-words whitespace-pre-wrap relative text-sm", {
              "blur-sm text-gray-600 select-none":
                tagsToDisplay.includes("quarantine"),
              "break-all": rest.content.split(" ").length === 1,
            })}
          >
            {rest.content}
          </p>
        ) : (
          <Link
            href={`/post/${rest.id}`}
            className={cn("break-words whitespace-pre-wrap relative text-sm", {
              "blur-sm text-gray-600 select-none":
                tagsToDisplay.includes("quarantine"),
              "break-all": rest.content.split(" ").length === 1,
            })}
          >
            <div>{rest.content}</div>
          </Link>
        )}

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
