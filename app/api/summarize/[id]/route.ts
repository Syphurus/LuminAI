import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE a summary
export async function DELETE(_req: NextRequest, { params }: any) {
  const { userId } = await auth();
  const summaryId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");

    const summary = await prisma.generatedSummary.findUnique({
      where: { id: summaryId },
    });

    if (!summary || summary.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.generatedSummary.delete({
      where: { id: summaryId },
    });

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
export async function PATCH(req: NextRequest, { params }: any) {
  const { userId } = await auth();
  const summaryId = params.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { summary } = await req.json();

    if (!summary) {
      return NextResponse.json(
        { error: "Summary content required" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const existing = await prisma.generatedSummary.findUnique({
      where: { id: summaryId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or unauthorized" },
        { status: 404 }
      );
    }

    const updated = await prisma.generatedSummary.update({
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
