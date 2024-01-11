"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { signOut, useSession } from "next-auth/react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { push } = useRouter();
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    push("/login");
  }

  if (status === "loading") {
    return (
      <div className="grid place-items-center pt-40">
        <Icons.spinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="text-sm flex justify-between items-center container">
      <div>
        <h2 className="font-semibold">{session?.user?.username}</h2>
        {session?.user?.createdAt && (
          <p className="text-muted-foreground mt-1">
            Joined{" "}
            {formatDistanceToNow(new Date(session?.user?.createdAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>
      <Button type="button" onClick={() => signOut()} className="mt-4">
        Logout
      </Button>
    </div>
  );
}
