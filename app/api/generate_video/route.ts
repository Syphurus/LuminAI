// app/api/generate_video/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, user_id } = await req.json();

    if (!prompt || !user_id) {
      return NextResponse.json(
        { error: "Prompt and user_id are required" },
        { status: 400 }
      );
    }

    // Send POST request to FastAPI backend at port 8002
    const response = await fetch("http://localhost:8002/api/generate_video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, user_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Failed to generate video" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
