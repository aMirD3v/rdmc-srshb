
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function authorizeSubmitterOrAdmin(session: any, itemId: string) {
  if (!session || !session.user || !session.user.id) {
    return { authorized: false, error: "Unauthorized" };
  }

  if (session.user.role === "ADMIN") {
    return { authorized: true };
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { submitterId: true },
  });

  if (!item || item.submitterId !== session.user.id) {
    return { authorized: false, error: "Forbidden" };
  }

  return { authorized: true };
}

export async function GET(req: Request, { params }: { params: { itemId: string } }) {
  const session = await auth();
  const { authorized, error } = await authorizeSubmitterOrAdmin(session, params.itemId);

  if (!authorized) {
    return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: params.itemId },
      include: { metadata: true, bitstreams: true, collection: true, submitter: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { itemId: string } }) {
  const session = await auth();
  const { authorized, error } = await authorizeSubmitterOrAdmin(session, params.itemId);

  if (!authorized) {
    return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  }

  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const item = await prisma.item.update({
      where: { id: params.itemId },
      data: {
        title,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
