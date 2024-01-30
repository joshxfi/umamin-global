import { signOut } from "next-auth/react";

import { Button } from "../ui/button";
import { DialogDrawer } from "../dialog-drawer";
import { UsernameSettings } from "../settings/username";

export function Settings({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DialogDrawer open={open} setOpen={setOpen}>
      <UsernameSettings />

      <Button
        title="Sign Out"
        type="button"
        variant="outline"
        onClick={() => signOut()}
        className=" w-full"
      >
        Sign Out
      </Button>
    </DialogDrawer>
  );
}
