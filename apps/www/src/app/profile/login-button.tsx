"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutComponent() {
  return (
    <Button type="button" onClick={() => signOut()} className="mt-4">
      Logout
    </Button>
  );
}
export function SignInComponent() {
  return (
    <Button type="button" onClick={() => signIn("google")} className="mt-4">
      Login
    </Button>
  );
}
