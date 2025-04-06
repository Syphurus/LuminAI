import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const videos = await db.generatedVideo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { videoUrl, prompt } = await req.json();
    if (!videoUrl || !prompt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newVideo = await db.generatedVideo.create({
      data: { userId, prompt, videoUrl },
    });

    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save video" },
      { status: 500 }
    );
  }
}
