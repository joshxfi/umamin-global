/* eslint-disable no-unused-vars */
import "next-auth";
import prisma from "@/lib/db";
import { Role } from "@ummx/codegen/__generated__/graphql";
import { type DefaultSession } from "next-auth";

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
