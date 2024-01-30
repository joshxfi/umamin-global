import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container">
      <div className="mx-auto mt-5 flex w-full max-w-lg items-center  justify-between xl:max-w-xl">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        </div>
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    </div>
  );
}
