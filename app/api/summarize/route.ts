import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const summaries = await db.generatedSummary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(summaries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch summaries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { prompt, summary } = await req.json();
    if (!prompt || !summary) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newSummary = await db.generatedSummary.create({
      data: { userId, prompt, summary },
    });

    return NextResponse.json(newSummary);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save summary" },
      { status: 500 }
    );
  }
}
