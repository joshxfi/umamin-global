import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="mb-5">
        <h2 className="text-3xl font-semibold">Not Found</h2>
        <p className="text-zinc-400">Could not find requested resource</p>
      </div>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
