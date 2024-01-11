import { z } from "zod";
import { Role } from "@tf/codegen/__generated__/graphql";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: z.nativeEnum(Role),
  createdAt: z.any(),
});

export type AuthedUser = z.infer<typeof userSchema>;
