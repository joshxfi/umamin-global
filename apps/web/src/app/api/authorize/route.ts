import prisma from "@/utils/db";
import { userSchema } from "./_types";
import { isPassword } from "@/utils/helpers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { username, password } = await req.json();

    if (!username && typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!password && typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user && user.password && isPassword(password, user.password)) {
      try {
        const data = await userSchema.parseAsync(user);
        return NextResponse.json(data, { status: 200 });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return NextResponse.json(
          { error: "Validation error" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
  }

  return NextResponse.json(
    { error: `Method [${req.method}] not allowed.` },
    { status: 405 }
  );
}
