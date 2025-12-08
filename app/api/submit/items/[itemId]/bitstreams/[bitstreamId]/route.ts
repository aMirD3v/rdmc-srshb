
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";

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

export async function DELETE(req: Request, { params }: { params: { itemId: string, bitstreamId: string } }) {
  const session = await auth();
  const { authorized, error } = await authorizeSubmitterOrAdmin(session, params.itemId);

  if (!authorized) {
    return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  }

  try {
    const bitstream = await prisma.bitstream.findUnique({
      where: { id: params.bitstreamId },
    });

    if (!bitstream) {
      return NextResponse.json({ error: "Bitstream not found" }, { status: 404 });
    }

    // Delete the file from the filesystem
    await unlink(bitstream.storageKey);

    // Delete the bitstream record from the database
    await prisma.bitstream.delete({
      where: { id: params.bitstreamId },
    });

    return NextResponse.json({ message: "Bitstream deleted successfully" });
  } catch (error) {
    console.error("Error deleting bitstream:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
