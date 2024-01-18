import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@umamin-global/codegen/__generated__";
import { formatDistanceToNow } from "date-fns";

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
  const { data } = useQuery(GET_USER, {
    variables: { username: params.username },
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
