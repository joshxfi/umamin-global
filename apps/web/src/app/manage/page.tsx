"use client"

import { useSession } from "next-auth/react";
import { ManageTags } from "@/components/manage/manage-tags";
import { ManageMods } from "@/components/manage/manage-mods";

export default function Manage() {
  const { data: session } = useSession();
  const hasAccess =
    process.env.NEXT_PUBLIC_ALLOW_ACCESS === session?.user?.username;

  if (!hasAccess) {
    return null;
  }

  return (
    <section className="container space-y-24 min-h-screen pb-24">
      <ManageTags />
      <ManageMods />
    </section>
  );
}
