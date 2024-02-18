"use client";

import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { cn } from "@/lib/utils";
import NotFound from "@/app/not-found";
import Loading from "@/app/user/loading";
import { UserPosts } from "./user-posts";
import { Button } from "@/components/ui/button";
import { ProfileDropdownMenu } from "./profile-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdSense = dynamic(() => import("@/components/adsense"), {
  ssr: false,
});

const GET_USER = gql(`
query GetUser($username: String!) {
  getUser(username: $username) {
    id
    createdAt
    username
    image
    bio
  }
}
`);

export default function UserProfile({ username }: { username: string }) {
  // Remove @ character from username
  const removeSlug = (param: string | undefined) => {
    if (!param) return;
    return param.startsWith("%40") ? param.split("%40").at(1) : param;
  };

  const { data: session, status } = useSession();
  const isCurrentUser = username === session?.user.username;

  const { data, loading } = useQuery(GET_USER, {
    skip: isCurrentUser,
    variables: { username: removeSlug(username)! },
  });

  const _user = isCurrentUser ? session?.user : data?.getUser;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (isCurrentUser) return;

    if (username && !username.startsWith("%40")) {
      const newUrl = `@${username}`;

      // Update to useRouter w/ Next 14.1
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl,
      );
    }
  }, [username, isCurrentUser]);

  if (loading || status === "loading") return <Loading />;
  if (!data?.getUser && !isCurrentUser) return <NotFound />;

  return (
    mounted && (
      <main>
        <section className="container">
          <div className="flex justify-between py-5">
            <Avatar className="h-20 w-20">
              <AvatarImage
                className="rounded-full"
                src={_user?.image as string | undefined}
                alt={`${_user?.username}'s avatar`}
              />
              <AvatarFallback className="text-xs">
                {_user?.username?.split(" ").at(0)}
              </AvatarFallback>
            </Avatar>

            {isCurrentUser ? (
              <div className="flex flex-col gap-2">
                <ProfileDropdownMenu />
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  title="Follow"
                  type="button"
                  variant="outline"
                  onClick={() =>
                    toast.message("Follow User", {
                      description: "Feature coming soon!",
                    })
                  }
                  className=" w-full"
                >
                  Follow
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-3 min-w-0">
            <div>
              <span className="font-semibold text-xl">
                @{_user?.username ?? "user"}
              </span>
              {_user?.createdAt && (
                <p className="text-muted-foreground text-sm mt-1">
                  Joined{" "}
                  {formatDistanceToNow(new Date(_user?.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
              <p
                className={cn("mt-3 text-sm break-words", {
                  "break-all": _user?.bio?.split(" ").length === 1,
                })}
              >
                {_user?.bio}
              </p>
            </div>
          </div>
        </section>

        {/* umg-profile */}
        <AdSense slotId="1121335316" className="my-4" />

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full border-b bg-transparent">
            <TabsTrigger value="posts" className="w-full">
              Posts
            </TabsTrigger>
            <TabsTrigger value="replies" className="w-full">
              Replies
            </TabsTrigger>
            <TabsTrigger value="likes" className="w-full">
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {_user?.id && <UserPosts authorId={_user.id} />}
          </TabsContent>

          <TabsContent value="replies">
            {_user?.id && <UserPosts isComment={true} authorId={_user.id} />}
          </TabsContent>

          <TabsContent value="likes">
            <p className="text-center mt-8 text-muted-foreground text-sm">
              Coming soon
            </p>
          </TabsContent>
        </Tabs>
      </main>
    )
  );
}
