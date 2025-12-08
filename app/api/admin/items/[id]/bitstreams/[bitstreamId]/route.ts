
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";

export async function DELETE(req: Request, { params }: { params: { id: string, bitstreamId: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
