import UserProfile from "@/components/profile/user-profile";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const username = params.username.startsWith("%40")
    ? params.username.split("%40").at(1)
    : params.username;
  const title = params.username
    ? `(@${username}) on Umamin Global`
    : // TODO: Check if user exists
      "User not found | Umamin Global";

  return {
    title: title,
  };
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  return <UserProfile username={params.username} />;
}
