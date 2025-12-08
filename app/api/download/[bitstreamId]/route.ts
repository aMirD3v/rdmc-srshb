
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";

export async function GET(req: Request, { params }: { params: { bitstreamId: string } }) {
  try {
    const bitstream = await prisma.bitstream.findUnique({
      where: { id: params.bitstreamId },
    });

    if (!bitstream) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = await readFile(bitstream.storageKey);

    return new NextResponse(file, {
      headers: {
        "Content-Disposition": `attachment; filename="${bitstream.name}"`,
        "Content-Type": bitstream.mimeType,
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
