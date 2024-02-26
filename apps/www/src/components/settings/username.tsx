"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { gql } from "@umamin-global/codegen/generated";

const SET_USERNAME = gql(`
mutation SetUsername($username: String!) {
  setUsername(username: $username)
}
`);

export function UsernameSettings() {
  const { data: session, update } = useSession();
  const [username, setUsername] = useState(session?.user.username ?? "");

  const [setUsernameFn, { loading }] = useMutation(SET_USERNAME);

  const handleSetUsername: React.FormEventHandler = (e) => {
    e.preventDefault();

    setUsernameFn({
      variables: {
        username,
      },
      onCompleted: () => {
        update({ user: { username } });
        toast.success("Username set successfully");
      },
      onError: (err) => {
        console.log(err);
        if (err.message.includes("User_username_key")) {
          toast.error("Username already taken");
        } else {
          toast.error(err.message);
        }
      },
    });
  };

  return (
    <div>
      <p className="text-sm mb-2">Username</p>
      <form className="flex space-x-4" onSubmit={handleSetUsername}>
        <Input
          required
          type="text"
          minLength={3}
          maxLength={15}
          value={username}
          disabled={loading}
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button
          disabled={loading || username === session?.user.username}
          type="submit"
        >
          Update
        </Button>
      </form>
    </div>
  );
}
