"use client";

import { useSession } from "next-auth/react";
import UserProfile from "@/components/profile/user-profile";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") router.push("/login");

  // TODO: Require username on sign up
  return <UserProfile username={session?.user.username!} />;
}
