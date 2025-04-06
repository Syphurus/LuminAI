import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Delete image by ID
export async function DELETE(req: NextRequest, { params }: any) {
  const { userId } = await auth();
  const imageId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const image = await db.generatedImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.generatedImage.delete({ where: { id: imageId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// PATCH: Update image prompt
export async function PATCH(req: NextRequest, { params }: any) {
  const { userId } = await auth();
  const imageId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const image = await db.generatedImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    const updated = await db.generatedImage.update({
      where: { id: imageId },
      data: { prompt },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
