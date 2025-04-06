import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const { userId } = await auth();
  const imageId = context.params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Make sure the image belongs to this user
    const image = await db.generatedImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.userId !== userId) {
      return NextResponse.json(
        { error: "Image not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.generatedImage.delete({
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
