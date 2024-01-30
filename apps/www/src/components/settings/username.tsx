import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { gql } from "@umamin-global/codegen/__generated__";
import { toast } from "sonner";

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
        toast.error(err.message);
      },
    });
  };

  return (
    <div>
      <p className="text-sm mb-4">@{session?.user.username || "user"}</p>
      <form className="flex space-x-4" onSubmit={handleSetUsername}>
        <Input
          type="text"
          disabled={loading}
          required
          value={username}
          placeholder="Choose a username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button disabled={loading} type="submit">
          Update
        </Button>
      </form>
    </div>
  );
}
