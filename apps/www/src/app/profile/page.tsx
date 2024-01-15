import { formatDistanceToNow } from "date-fns";
import { getServerAuthSession } from "../api/auth/[...nextauth]/_options";
import { SignInComponent, SignOutComponent } from "./login-button";

export default async function Profile() {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <div>
        <p>Not logged in</p>
        <SignInComponent />
      </div>
    );
  }

  return (
    <div className="text-sm flex justify-between items-center container">
      <div>
        <h2 className="font-semibold">{session.user?.name}</h2>
        {session?.user?.createdAt && (
          <p className="text-muted-foreground mt-1">
            Joined{" "}
            {formatDistanceToNow(new Date(session?.user?.createdAt), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>

      <SignOutComponent />
    </div>
  );
}
