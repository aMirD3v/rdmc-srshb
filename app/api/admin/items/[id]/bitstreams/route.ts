
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bitstreams = await prisma.bitstream.findMany({
      where: { itemId: params.id },
    });

    return NextResponse.json(bitstreams);
  } catch (error) {
    console.error("Error fetching bitstreams:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), "uploads");
    const filePath = join(uploadsDir, file.name);
    await writeFile(filePath, buffer);

    const newBitstream = await prisma.bitstream.create({
      data: {
        itemId: params.id,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        storageKey: filePath, // Storing the local path for now
      },
    });

    return NextResponse.json(newBitstream, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
