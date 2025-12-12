import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rawItems = await prisma.item.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        metadata: {
          where: {
            key: 'dc.description.abstract',
          },
        },
      },
    });

    // Process the raw data to create a clean, structured response
    const items = rawItems.map(item => {
      // Find the abstract from the metadata array, if it exists
      const abstract = item.metadata.find(m => m.key === 'dc.description.abstract')?.value || '';
      return {
        id: item.id,
        title: item.title,
        abstract: abstract,
      };
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching recent items:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
