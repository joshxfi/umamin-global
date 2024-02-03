import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { Icons } from "../icons";

export function Badge({
  name,
  className,
  withRemove,
}: {
  name: string;
  className?: string;
  withRemove?: boolean;
}) {
  const tag = useCallback((_tag: string) => _tag === name, [name]);

  return (
    <div
      className={cn(
        "py-1 px-2 text-secondary-foreground text-xs bg-secondary border-2 border-gray-700 rounded-full leading-none",
        {
          "bg-gray-900": tag("you"),
          "bg-cyan-900 border-cyan-700": tag("story"),
          "bg-lime-900 border-lime-700": tag("insight"),
          "bg-amber-900 border-amber-700": tag("rant"),
          "bg-fuchsia-900 border-fuchsia-700": tag("confession"),
          "bg-indigo-900 border-indigo-700": tag("question"),
          "font-semibold border-yellow-500": tag("quarantine"),
          "font-semibold border-red-600": tag("nsfw"),
        },
        {
          "flex space-x-[6px] items-center": withRemove,
        },
        className
      )}
    >
      <p>{name}</p>
      {withRemove && <Icons.xMark className="text-gray-200" />}
    </div>
  );
}
