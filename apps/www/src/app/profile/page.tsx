"use client";

import { useSession } from "next-auth/react";
import { SignInButton } from "../../components/auth-button";
import UserProfile from "./user-profile";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated" || !session) {
    return (
      <div>
        <p>Not logged in</p>
        <SignInButton />
      </div>
    );
  }

  // TODO: Require username on sign up
  return <UserProfile username={session?.user.username!} />;
}
