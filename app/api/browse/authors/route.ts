import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 50; // Return more items per page for a browse list

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);

    const authorMetadata = await prisma.metadataField.findMany({
      where: { 
        key: 'dc.contributor.author',
        item: {
            status: 'PUBLISHED'
        }
      },
      select: {
        value: true,
      }
    });

    const authorFrequency = new Map<string, number>();
    authorMetadata.forEach(field => {
      field.value.split(';').map(s => s.trim()).filter(Boolean).forEach(author => {
        const normalizedAuthor = author.toLowerCase();
        authorFrequency.set(normalizedAuthor, (authorFrequency.get(normalizedAuthor) || 0) + 1);
      });
    });

    const sortedAuthors = Array.from(authorFrequency.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    const totalItems = sortedAuthors.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const paginatedAuthors = sortedAuthors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return NextResponse.json({
        items: paginatedAuthors,
        totalPages,
        currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching browse authors:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
