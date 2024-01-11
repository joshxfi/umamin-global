import { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@tf/codegen/__generated__";
import { Role } from "@tf/codegen/__generated__/graphql";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmButton } from "@/components/confirm-button";

const GET_USERS = gql(`
query GetUsers($role: Role!) {
  getUsers(role: $role) {
    id
    username
  }
}
`);

const SET_USER_ROLE = gql(`
mutation setUserRole($role: Role!, $username: String!) {
  setUserRole(role: $role, username: $username) {
    id
    username
  }
}
`);

export function ManageMods() {
  const { toast } = useToast();
  const { data, refetch } = useQuery(GET_USERS, {
    variables: {
      role: Role.Moderator,
    },
  });
  const [setUserRole, { loading }] = useMutation(SET_USER_ROLE);

  const [username, setUsername] = useState("");

  const handleUserRole = (username: string, role: Role) => {
    setUserRole({
      variables: {
        username,
        role,
      },
      onCompleted: () => {
        setUsername("");
        refetch();
        toast({
          title: "Success",
          description: `Added ${username} as content moderator`,
        });
      },
      onError: (err) => {
        console.log(err);

        toast({
          title: "Error",
          description: "Something went wrong",
        });
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-medium">Content Moderators</h1>
      <p className="text-muted-foreground text-sm">Click on a user to revoke</p>
      <div className="flex flex-wrap gap-2 mt-4">
        {!data?.getUsers.length && <Badge name="none" />}
        {data?.getUsers.map((user) => (
          <ConfirmButton
            key={user.id}
            title="Remove content moderator"
            body={`Are you sure you want to remove "${user.username}"?`}
            onConfirm={() => handleUserRole(user.username, Role.User)}
          >
            <button disabled={loading}>
              <Badge name={user.username} />
            </button>
          </ConfirmButton>
        ))}
      </div>

      <div className="space-y-4 mt-12">
        <div className="grid gap-2">
          <Label htmlFor="password">Assign a new content moderator</Label>
          <Input
            value={username}
            disabled={loading}
            onChange={(e) => setUsername(e.target.value)}
            className="max-w-[300px]"
            placeholder="Enter username"
          />
        </div>
        <ConfirmButton
          title="Assign content moderator"
          body={`Are you sure you want to assign the user "${username}"?`}
          onConfirm={() => handleUserRole(username, Role.Moderator)}
        >
          <Button disabled={!username || loading}>Proceed</Button>
        </ConfirmButton>
      </div>
    </div>
  );
}
