import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);

    const subjectMetadata = await prisma.metadataField.findMany({
      where: { 
        key: 'dc.subject',
        item: {
            status: 'PUBLISHED'
        }
      },
      select: {
        value: true,
      }
    });

    const subjectFrequency = new Map<string, number>();
    subjectMetadata.forEach(field => {
      field.value.split(';').map(s => s.trim()).filter(Boolean).forEach(subject => {
        const normalizedSubject = subject.toLowerCase();
        subjectFrequency.set(normalizedSubject, (subjectFrequency.get(normalizedSubject) || 0) + 1);
      });
    });

    const sortedSubjects = Array.from(subjectFrequency.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    const totalItems = sortedSubjects.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const paginatedSubjects = sortedSubjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return NextResponse.json({
        items: paginatedSubjects,
        totalPages,
        currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching browse subjects:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
