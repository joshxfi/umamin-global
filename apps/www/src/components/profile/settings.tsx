import { BioSettings } from "../settings/bio";
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
      <div className="space-y-4">
        <UsernameSettings />
        <BioSettings />
      </div>
    </DialogDrawer>
  );
}
