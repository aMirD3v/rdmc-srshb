
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
      orderBy: { key: 'asc' }, // Ensure consistent order
    });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();

  // Ensure user is an admin or a submitter
  if (!session || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUBMITTER')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key, value } = await req.json();

  if (!key || value === null || value === undefined) {
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();

    // Ensure user is an admin or a submitter
    if (!session || !session.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUBMITTER')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const metadataUpdates: { id: string, value: string }[] = await req.json();

    if (!Array.isArray(metadataUpdates)) {
        return NextResponse.json({ error: "Invalid request body. Expected an array of metadata objects." }, { status: 400 });
    }

    try {
        const updatedMetadata = await prisma.$transaction(
            metadataUpdates.map(m =>
                prisma.metadataField.update({
                    where: { id: m.id },
                    data: { value: m.value },
                })
            )
        );

        return NextResponse.json(updatedMetadata);
    } catch (error) {
        console.error("Error updating metadata:", error);
        return NextResponse.json({ error: "Something went wrong during the update." }, { status: 500 });
    }
}
