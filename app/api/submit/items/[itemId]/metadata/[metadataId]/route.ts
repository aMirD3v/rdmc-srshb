
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function authorizeSubmitterOrAdmin(session: any, itemId: string) {
  if (!session || !session.user || !session.user.id) {
    return { authorized: false, error: "Unauthorized" };
  }

  if (session.user.role === "ADMIN") {
    return { authorized: true };
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { submitterId: true },
  });

  if (!item || item.submitterId !== session.user.id) {
    return { authorized: false, error: "Forbidden" };
  }

  return { authorized: true };
}

export async function DELETE(req: Request, { params }: { params: { itemId: string, metadataId: string } }) {
  const session = await auth();
  const { authorized, error } = await authorizeSubmitterOrAdmin(session, params.itemId);

  if (!authorized) {
    return NextResponse.json({ error }, { status: error === "Unauthorized" ? 401 : 403 });
  }

  try {
    await prisma.metadataField.delete({
      where: { id: params.metadataId },
    });

    return NextResponse.json({ message: "Metadata field deleted successfully" });
  } catch (error) {
    console.error("Error deleting metadata:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
