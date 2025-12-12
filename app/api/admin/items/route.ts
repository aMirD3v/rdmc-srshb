
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

    const defaultMetadata = [
      { key: 'dc.title', value: title },
      { key: 'dc.contributor.author', value: '' },
      { key: 'dc.title.alternative', value: '' },
      { key: 'dc.date.issued', value: '' },
      { key: 'dc.publisher', value: '' },
      { key: 'dc.identifier.citation', value: '' },
      { key: 'dc.relation.ispartofseries', value: '' },
      { key: 'dc.identifier.uri', value: '' },
      { key: 'dc.type', value: '' },
      { key: 'dc.language.iso', value: '' },
      { key: 'dc.subject', value: '' },
      { key: 'dc.description.abstract', value: '' },
      { key: 'dc.description.sponsorship', value: '' },
      { key: 'dc.description', value: '' },
    ];

    const item = await prisma.$transaction(async (tx) => {
      const newItem = await tx.item.create({
        data: {
          title,
          collectionId,
          submitterId: session.user.id,
          status,
        },
      });

      const metadataToCreate = defaultMetadata.map(meta => ({
        ...meta,
        itemId: newItem.id,
      }));

      await tx.metadataField.createMany({
        data: metadataToCreate,
      });

      return newItem;
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
