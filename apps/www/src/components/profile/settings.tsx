import { signOut } from "next-auth/react";

import { Button } from "../ui/button";
import { DialogDrawer } from "../dialog-drawer";
import { UsernameSettings } from "../settings/username";
import { BioSettings } from "../settings/bio";

export function Settings({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DialogDrawer open={open} setOpen={setOpen}>
      <div className="space-y-4">
        <UsernameSettings />
        <BioSettings />
      </div>

      <Button
        title="Sign Out"
        type="button"
        variant="outline"
        onClick={() => signOut()}
        className="w-full mt-4"
      >
        Sign Out
      </Button>
    </DialogDrawer>
  );
}
