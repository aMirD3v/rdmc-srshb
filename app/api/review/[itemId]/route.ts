
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { itemId: string } }) {
  const session = await auth();

  if (!session || session.user.role !== "REVIEWER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();

  if (!status || (status !== "PUBLISHED" && status !== "REJECTED")) {
    return NextResponse.json({ error: "Invalid status provided" }, { status: 400 });
  }

  try {
    const updatedItem = await prisma.item.update({
      where: { id: params.itemId },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item status:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
