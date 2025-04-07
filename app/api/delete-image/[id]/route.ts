import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest, { params }: any) {
  const { prisma } = await import("@/lib/prisma"); // ✅ dynamic import
  const { userId } = await auth();
  const imageId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const image = await prisma.generatedImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.userId !== userId) {
      return NextResponse.json(
        { error: "Image not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.generatedImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
