import "next-auth";
import prisma from "@/lib/db";

export interface TContext {
  prisma: typeof prisma;
  id?: string;
}
