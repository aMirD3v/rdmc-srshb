
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id || (session.user.role !== 'ADMIN' && session.user.role !== 'SUBMITTER')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, collectionId } = await req.json();

  if (!title || !collectionId) {
    return NextResponse.json({ error: "Title and collectionId are required" }, { status: 400 });
  }

  try {
    const status = session.user.role === 'ADMIN' ? 'PUBLISHED' : 'IN_REVIEW';

    const item = await prisma.item.create({
      data: {
        title,
        collectionId,
        submitterId: session.user.id,
        status,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
