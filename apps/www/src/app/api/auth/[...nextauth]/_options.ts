import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { AuthedUser } from "../../authorize/_types";
import { Role } from "@ummx/codegen/__generated__/graphql";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authorize`, {
          method: "POST",
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        if (res.ok) {
          const user = (await res.json()) as AuthedUser;
          return user;
        }

        return Promise.reject(new Error("Invalid credentials"));
      },
    }),
  ],
  pages: {
    signIn: "/register",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.createdAt = user.createdAt;
        return token;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.username = token.username as string;
        session.user.role = token.role as Role;
        session.user.createdAt = token.createdAt;
      }
      return session;
    },
  },
};
