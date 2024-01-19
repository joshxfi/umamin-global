import UserProfile from "../user-profile";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  return <UserProfile username={params.username} />;
}
