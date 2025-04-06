import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, prompt, userId } = await req.json();

    if (!imageUrl || !prompt || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newImage = await db.generatedImage.create({
      data: {
        userId,
        imageUrl,
        prompt,
      },
    });

    return NextResponse.json({ success: true, data: newImage });
  } catch (error) {
    console.error("Error saving image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
