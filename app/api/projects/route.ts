import { auth } from "@clerk/nextjs/server";

import { readProjectNameInput } from "@/lib/api-request";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_NAME = "Untitled Project";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = await readProjectNameInput(request);

  if (!input) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      ...(input.id ? { id: input.id } : {}),
      ownerId: userId,
      name: input.name ?? DEFAULT_PROJECT_NAME,
    },
  });

  return Response.json({ project }, { status: 201 });
}
