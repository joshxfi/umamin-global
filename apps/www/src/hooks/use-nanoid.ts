import { useMemo } from "react";
import { nanoid } from "nanoid";

export function useNanoid(length: number) {
  const ids = useMemo(() => Array.from({ length }).map(() => nanoid()), [length]);
  return ids;
}
