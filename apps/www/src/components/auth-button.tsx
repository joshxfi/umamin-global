"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type ButtonProps = {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
};

export function SignOutButton({ className, variant }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => signOut()}
      className={className}
    >
      Logout
    </Button>
  );
}

export function SignInButton({ className, variant }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => signIn("google")}
      className={className}
    >
      Login
    </Button>
  );
}
