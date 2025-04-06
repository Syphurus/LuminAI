import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET: Fetch image history
export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const images = await db.generatedImage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching image history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// POST: Save generated image
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { imageUrl, prompt } = await req.json();
    if (!imageUrl || !prompt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newImage = await db.generatedImage.create({
      data: { userId, prompt, imageUrl },
    });

    return NextResponse.json(newImage);
  } catch (error) {
    console.error("Error saving image:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}
