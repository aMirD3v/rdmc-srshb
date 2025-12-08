
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string, metadataId: string } }) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
