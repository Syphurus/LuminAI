import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// DELETE: Delete a specific video by ID
export async function DELETE(_: Request, { params }: any) {
  const { userId } = await auth();
  const videoId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const video = await db.generatedVideo.findUnique({
      where: { id: videoId },
    });

    if (!video || video.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.generatedVideo.delete({ where: { id: videoId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
