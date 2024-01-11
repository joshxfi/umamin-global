"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { gql } from "@ummx/codegen/__generated__";
import { signIn, useSession } from "next-auth/react";

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
import { Checkbox } from "@/components/ui/checkbox";

const CREATE_USER = gql(`
mutation CreateUser($password: String!, $username: String!) {
  createUser(password: $password, username: $username) {
    id
    username
  }
}
`);

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [mutate] = useMutation(CREATE_USER);

  const { status } = useSession();
  const { push } = useRouter();
  const { toast } = useToast();

  if (status === "authenticated") {
    push("/");
  }

  const handleAuth: React.FormEventHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    mutate({
      variables: {
        username,
        password,
      },
      onCompleted: async (data) => {
        toast({
          title: "Account Created",
          description: `Logging in, please wait...`,
        });

        const res = await signIn("credentials", {
          username,
          password,
          redirect: false,
        });

        if (res?.error) {
          toast({ title: "Error", description: res.error });
        }

        if (res?.ok) {
          push("/");
          toast({
            title: "Success",
            description: `Welcome ${data.createUser.username}!`,
          });
        }

        setLoading(false);
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message });
        setLoading(false);
      },
    });
  };

  return (
    <form onSubmit={handleAuth} className="container">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex justify-between items-center">
            <p>Create an account</p>
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
              placeholder="Do not use your real name!"
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

          <div className="flex items-center space-x-2">
            <Checkbox required id="terms" />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
            >
              I agree to the <Link href="/terms" className="underline">terms of service</Link>
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start">
          <Button disabled={loading} type="submit" className="w-full">
            Create Account
          </Button>

          <p className="mt-3 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-white">
              Login &rarr;
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
