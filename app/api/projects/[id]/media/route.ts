import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/media — list media for a project
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const media = await prisma.projectMedia.findMany({
    where: { projectId: id },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ media });
}

// PUT /api/projects/[id]/media — reorder media items
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { items } = await req.json();

  await Promise.all(
    (items as { id: string; sortOrder: number }[]).map((item) =>
      prisma.projectMedia.update({
        where: { id: item.id, projectId: id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  return NextResponse.json({ message: "Media reordered" });
}
