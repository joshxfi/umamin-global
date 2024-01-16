/* eslint-disable no-unused-vars */
import "next-auth";
import prisma from "@/lib/db";
import { type DefaultSession } from "next-auth";
import { Role } from "@umamin-global/codegen/__generated__/graphql";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: Role;
      username?: string;
      createdAt?: any;
    } & DefaultSession["user"];
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
