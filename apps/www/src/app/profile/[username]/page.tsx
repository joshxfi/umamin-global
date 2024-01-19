"use client";

import { formatDistanceToNow } from "date-fns";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useEffect } from "react";

const GET_USER = gql(`
query GetUser($username: String!) {
  getUser(username: $username) {
    id
    createdAt
    username
    image
    bio
  }
}
`);

export default function ProfileByUsername({
  params,
}: {
  params: { username: string };
}) {
  useEffect(() => {
    if (params.username && !params.username.startsWith("%40")) {
      const newUrl = `@${params.username}`;

      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    }
  }, [params.username]);

  // Remove @ character from username
  const removeSlug = (param: string) => {
    return param.startsWith("%40") ? param.split("%40").at(1) : param;
  };

  const { data } = useQuery(GET_USER, {
    variables: { username: removeSlug(params.username)! },
  });

  return (
    <div className="text-sm flex justify-between items-center container">
      <div>
        <h2 className="font-semibold">{data?.getUser.username}</h2>
        {data?.getUser.createdAt && (
          <p className="text-muted-foreground mt-1">
            Joined{" "}
            {formatDistanceToNow(new Date(data?.getUser.createdAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
