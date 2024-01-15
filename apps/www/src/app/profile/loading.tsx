import { Icons } from "@/components/icons";

export default function Loading() {
  return (
    <div className="grid place-items-center pt-40">
      <Icons.spinner className="w-12 h-12" />
    </div>
  );
}
