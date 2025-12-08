
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const metadata = await prisma.metadataField.findMany({
      where: { itemId: params.id },
    });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key, value } = await req.json();

  if (!key || !value) {
    return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
  }

  try {
    const newMetadata = await prisma.metadataField.create({
      data: {
        itemId: params.id,
        key,
        value,
      },
    });

    return NextResponse.json(newMetadata, { status: 201 });
  } catch (error) {
    console.error("Error creating metadata:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
