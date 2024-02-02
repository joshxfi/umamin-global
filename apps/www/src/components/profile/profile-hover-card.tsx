"use client";

import Link from "next/link";
import { toast } from "sonner";
// import type { User } from "~/lib/types";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { CalendarDays } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import type { PostData } from "@/types";

type ProfileHoverCardProps = {
  children: React.ReactNode;
  author: PostData["author"];
  userId: string | undefined;
};

export function ProfileHoverCard({
  children,
  author,
  userId,
}: ProfileHoverCardProps) {
  const userUsername = author.username ? "@" + author.username : author.id;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-lg font-semibold">{"@" + author.username}</h4>
              {/* <h4 className="text-sm font-normal text-zinc-200">
                  Description?
                </h4> */}
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>

          <Link href={`/user/${userUsername}`} className="font-semibold">
            <Avatar className="h-16 w-16">
              <AvatarImage
                className="rounded-full"
                src={author.image as string | undefined}
                alt={`${"@" + author.username}'s avatar`}
              />
              <AvatarFallback className="text-xs">
                {author.username?.split(" ").at(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
        {author.id !== userId && (
          <Button
            title="follow"
            onClick={() => toast.info("Feature coming soon!")}
            className="mt-4 w-full"
          >
            Follow
          </Button>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
