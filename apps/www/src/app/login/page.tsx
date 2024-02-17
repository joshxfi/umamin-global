"use client";

import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import FeedLoading from "@/components/post/feed-loading";

export default function Login() {
  const { status } = useSession();
  const { push } = useRouter();

  if (status === "authenticated") {
    push("/");
  }

  if (status === "loading") {
    return <FeedLoading />;
  }

  return (
    <section className="max-w-lg container">
      <Card className="space-y-5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex justify-between items-center">
            <p>Login to proceed</p>
          </CardTitle>
          <CardDescription>A Social Platform for the Umamin Community</CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col items-start">
          <Button onClick={() => signIn("google")} className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
