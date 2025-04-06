import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE a summary
export async function DELETE(
  _: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = await auth();
  const summaryId = context.params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await db.generatedSummary.findUnique({
      where: { id: summaryId },
    });

    if (!summary || summary.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.generatedSummary.delete({ where: { id: summaryId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting summary:", error);
    return NextResponse.json(
      { error: "Failed to delete summary" },
      { status: 500 }
    );
  }
}

// PATCH to edit a summary's text
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = await auth();
  const summaryId = context.params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { summary } = await req.json();
  if (!summary) {
    return NextResponse.json(
      { error: "Summary content required" },
      { status: 400 }
    );
  }

  try {
    const existing = await db.generatedSummary.findUnique({
      where: { id: summaryId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    const updated = await db.generatedSummary.update({
      where: { id: summaryId },
      data: { summary },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating summary:", error);
    return NextResponse.json(
      { error: "Failed to update summary" },
      { status: 500 }
    );
  }
}
