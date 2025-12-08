
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, username, email, password, role } = await req.json();

  if (!name || !username || !email || !password) {
    return NextResponse.json({ error: "Name, username, email, and password are required" }, { status: 400 });
  }

  try {
    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        hashedPassword,
        role,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
