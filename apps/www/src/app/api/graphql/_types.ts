/* eslint-disable no-unused-vars */
import "next-auth";
import prisma from "@/utils/db";
import { Role } from "@ummx/codegen/__generated__/graphql";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      username?: string;
      role?: Role;
      createdAt?: any;
    };
  }

  interface User {
    username: string;
    role: Role;
    createdAt?: any;
  }
}

export interface TContext {
  prisma: typeof prisma;
  id?: string;
}
