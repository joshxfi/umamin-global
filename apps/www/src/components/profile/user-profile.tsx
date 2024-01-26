"use client";

import { formatDistanceToNow } from "date-fns";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import NotFound from "@/app/not-found";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { Settings } from "@/components/profile/settings";
import Loading from "@/app/user/loading";
import { UserPosts } from "./user-posts";
import { toast } from "sonner";

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

  const { data: session } = useSession();
  const isCurrentUser = username === session?.user.username;

  const { data, loading } = useQuery(GET_USER, {
    skip: isCurrentUser,
    variables: { username: removeSlug(username)! },
  });

  const _user = isCurrentUser ? session?.user : data?.getUser;

  const [openSettings, setOpenSettings] = useState(false);
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
        newUrl
      );
    }
  }, [username, isCurrentUser]);

  if (loading) return <Loading />;
  if (!data?.getUser && !isCurrentUser) return <NotFound />;

  return (
    mounted && (
      <main className="container">
        <section>
          <div className="flex items-center justify-between py-5">
            <div>
              <span className="font-semibold text-2xl">
                @{_user?.username ?? "Umamin User"}
              </span>
              {_user?.createdAt && (
                <p className="text-muted-foreground mt-1">
                  Joined{" "}
                  {formatDistanceToNow(new Date(_user?.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>
            <Avatar className="h-24 w-24">
              <AvatarImage
                className="rounded-full"
                src={_user?.image as string | undefined}
                alt={`${_user?.username}'s avatar`}
              />
              <AvatarFallback className="text-xs">
                {_user?.username?.split(" ").at(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/**
           * Change user button if profile is current user
           */}
          {isCurrentUser ? (
            <div className="flex gap-2">
              <Settings open={openSettings} setOpen={setOpenSettings} />
              <Button
                title="Update Profile"
                type="button"
                variant="outline"
                onClick={() => setOpenSettings(true)}
                className=" w-full"
              >
                Update Profile
              </Button>

              <Button
                title="Sign Out"
                type="button"
                variant="outline"
                onClick={() => {
                  signOut();
                  toast.message("Signed Out", {
                    description: "You have been signed out successfully",
                  });
                }}
                className=" w-full"
              >
                Sign Out
              </Button>
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

              <Button
                title="Mention"
                type="button"
                variant="outline"
                onClick={() =>
                  toast.message("Mention User", {
                    description: "Feature coming soon!",
                  })
                }
                className=" w-full"
              >
                Mention
              </Button>
            </div>
          )}
        </section>

        <Tabs defaultValue="posts" className="mt-5 w-full">
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
            <div className="flex justify-center pt-10 text-xl font-semibold">
              Likes tab coming soon..
            </div>
          </TabsContent>
        </Tabs>
      </main>
    )
  );
}
