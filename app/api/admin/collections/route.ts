
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, communityId } = await req.json();

  if (!name || !communityId) {
    return NextResponse.json({ error: "Name and communityId are required" }, { status: 400 });
  }

  try {
    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        communityId,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
