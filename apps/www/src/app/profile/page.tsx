"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Settings } from "@/components/profile/settings";
import { SignInButton, SignOutButton } from "../../components/auth-button";

export default function Profile() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "unauthenticated") {
    return (
      <div>
        <p>Not logged in</p>
        <SignInButton />
      </div>
    );
  }

  return (
    <div className="text-sm flex justify-between items-center container">
      <div>
        <h2 className="font-semibold">{session?.user.name}</h2>
        <h2 className="text-blue-400">@{session?.user.username || "user"}</h2>
        {session?.user?.createdAt && (
          <p className="text-muted-foreground mt-1">
            Joined{" "}
            {formatDistanceToNow(new Date(session?.user?.createdAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>

      <div className="space-x-2">
        <SignOutButton />
        <Button type="button" className="mt-4" onClick={() => setOpen(true)}>
          Settings
        </Button>
      </div>
      <Settings open={open} setOpen={setOpen} />
    </div>
  );
}
