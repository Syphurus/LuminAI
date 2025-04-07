import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Delete a specific video by ID
export async function DELETE(_: NextRequest, { params }: any) {
  const { prisma } = await import("@/lib/prisma");
  const { userId } = await auth();
  const videoId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const video = await prisma.generatedVideo.findUnique({
      where: { id: videoId },
    });

    if (!video || video.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.generatedVideo.delete({ where: { id: videoId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}

// PATCH: Update video prompt
export async function PATCH(req: NextRequest, { params }: any) {
  const { prisma } = await import("@/lib/prisma");
  const { userId } = await auth();
  const videoId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const video = await prisma.generatedVideo.findUnique({
      where: { id: videoId },
    });

    if (!video || video.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    const updated = await prisma.generatedVideo.update({
      where: { id: videoId },
      data: { prompt },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}
