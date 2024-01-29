import "reflect-metadata";

import { NextRequest } from "next/server";
import { ApolloServer } from "@apollo/server";
import { buildSchemaSync } from "type-graphql";
import { getServerSession } from "next-auth/next";
import { UserResolver } from "@/schema/user/user.resolvers";
import { PostResolver } from "@/schema/post/post.resolvers";
import { TagResolver } from "@/schema/tag/tag.resolvers";
import responseCachePlugin from "@apollo/server-plugin-response-cache";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import prisma from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/_options";

const schema = buildSchemaSync({
  resolvers: [UserResolver, PostResolver, TagResolver],
});

const server = new ApolloServer({
  schema,
  plugins: [responseCachePlugin()],
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    const session = await getServerSession(authOptions);
    const id = session?.user?.id;
    return { req, prisma, id };
  },
});

export { handler as GET, handler as POST };
