"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { status } = useSession();
  const { push } = useRouter();
  const { toast } = useToast();

  if (status === "authenticated") {
    push("/");
  }

  const handleAuth: React.FormEventHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast({ title: "Error", description: res.error });
      setLoading(false);
      return;
    }

    if (res?.ok) {
      push("/");
      toast({ title: "Success", description: `Welcome ${username}!` });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleAuth} className="container">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex justify-between items-center">
            <p>Login to proceed</p>
            {loading && <Icons.spinner className="w-8 h-8" />}
          </CardTitle>
          <CardDescription>an open space for universities</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative mb-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              required
              type="text"
              id="username"
              minLength={3}
              maxLength={15}
              value={username}
              onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
              placeholder="Enter your username"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              required
              id="password"
              type="password"
              minLength={3}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Button disabled={loading} type="submit" className="w-full">
            Login
          </Button>

          <p className="mt-3 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-white">
              Get started &rarr;
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
