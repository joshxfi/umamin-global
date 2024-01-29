import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    session: ({ session, user, trigger, newSession }) => {
      const _user = {
        ...session.user,
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      };

      if (trigger === "update" && newSession?.name) {
        _user.username = newSession.user.username;
      }

      return {
        ...session,
        user: _user,
      };
    },
  },

  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/register",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
