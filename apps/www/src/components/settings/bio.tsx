"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { gql } from "@umamin-global/codegen/__generated__";

const SET_BIO = gql(`
mutation SetBio($bio: String!) {
  setBio(bio: $bio)
}
`);

export function BioSettings() {
  const { data: session, update } = useSession();
  const [bio, setBio] = useState(session?.user.bio ?? "");

  const [setBioFn, { loading }] = useMutation(SET_BIO);

  const handleSetUsername: React.FormEventHandler = (e) => {
    e.preventDefault();

    setBioFn({
      variables: {
        bio,
      },
      onCompleted: () => {
        update({ user: { bio } });
        toast.success("Bio set successfully");
      },
      onError: (err) => {
        console.log(err);
        toast.error(err.message);
      },
    });
  };

  return (
    <div>
      <p className="text-sm mb-2">Bio</p>
      <form className="flex space-x-4" onSubmit={handleSetUsername}>
        <Textarea
          required
          value={bio}
          disabled={loading}
          placeholder="Enter your bio"
          onChange={(e) => setBio(e.target.value)}
        />

        <Button disabled={loading} type="submit">
          Update
        </Button>
      </form>
    </div>
  );
}
