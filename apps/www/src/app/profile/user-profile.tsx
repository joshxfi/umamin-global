"use client";

import { formatDistanceToNow } from "date-fns";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Remove @ character from username
  const removeSlug = (param: string) => {
    return param.startsWith("%40") ? param.split("%40").at(1) : param;
  };

  useEffect(() => {
    setMounted(true);

    if (username && !username.startsWith("%40")) {
      const newUrl = `@${username}`;

      // Update to useRouter w/ Next 14.1
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    }
  }, [username]);

  const { data } = useQuery(GET_USER, {
    variables: { username: removeSlug(username)! },
  });

  return (
    mounted && (
      <main className="container">
        <section>
          <div className="flex items-center justify-between py-5">
            <div>
              <span className="font-semibold text-2xl">
                @{data?.getUser.username}
              </span>
              {data?.getUser.createdAt && (
                <p className="text-muted-foreground mt-1">
                  Joined{" "}
                  {formatDistanceToNow(new Date(data?.getUser.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>
            <Avatar className="h-24 w-24">
              <AvatarImage
                className="rounded-full"
                src={data?.getUser.image as string | undefined}
                alt={`${data?.getUser.username}'s avatar`}
              />
              <AvatarFallback className="text-xs">
                {data?.getUser.username?.split(" ").at(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/**
           * Change user button if profile is current user
           */}
          {/* {isCurrentUser ? (
            <EditUserModal user={user} />
          ) : ( */}
          <div className="flex gap-2">
            <Button
              title="Follow"
              type="button"
              variant="outline"
              onClick={() =>
                toast({
                  title: "Follow User",
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
                toast({
                  title: "Mention User",
                  description: "Feature coming soon!",
                })
              }
              className=" w-full"
            >
              Mention
            </Button>
          </div>
          {/* )} */}
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
            {/* 
                Fetch posts by user
            */}
            {/* <Posts authorId={user.id} /> */}
          </TabsContent>

          <TabsContent value="replies">
            <div className="flex justify-center pt-10 text-xl font-semibold">
              Replies tab coming soon..
            </div>
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
