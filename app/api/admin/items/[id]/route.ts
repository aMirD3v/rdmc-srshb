
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: { metadata: true, bitstreams: true },
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

import { unlink } from "fs/promises";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const item = await prisma.item.update({
      where: { id: params.id },
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: { bitstreams: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Delete files from filesystem
    for (const bitstream of item.bitstreams) {
      await unlink(bitstream.storageKey);
    }

    // Delete item and related data from database in a transaction
    await prisma.$transaction([
      prisma.bitstream.deleteMany({ where: { itemId: params.id } }),
      prisma.metadataField.deleteMany({ where: { itemId: params.id } }),
      prisma.item.delete({ where: { id: params.id } }),
    ]);

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
