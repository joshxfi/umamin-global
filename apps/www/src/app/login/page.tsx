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

export default function Login() {
  const { status } = useSession();
  const { push } = useRouter();

  if (status === "authenticated") {
    push("/");
  }

  return (
    <section className="max-w-lg container">
      <Card className="space-y-5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex justify-between items-center">
            <p>Login to proceed</p>
          </CardTitle>
          <CardDescription>an open space for universities</CardDescription>
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
