import { auth } from "@clerk/nextjs/server";

import { readProjectNameInput } from "@/lib/api-request";
import { prisma } from "@/lib/prisma";

interface ProjectRouteContext {
  params: Promise<{ projectId: string }>;
}

async function getOwnedProject(projectId: string, ownerId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return { project: null, response: Response.json({ error: "Project not found" }, { status: 404 }) };
  }

  if (project.ownerId !== ownerId) {
    return { project: null, response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { project, response: null };
}

export async function PATCH(request: Request, context: ProjectRouteContext) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const ownedProject = await getOwnedProject(projectId, userId);

  if (ownedProject.response) {
    return ownedProject.response;
  }

  const input = await readProjectNameInput(request);

  if (!input || input.name === undefined) {
    return Response.json({ error: "A project name is required" }, { status: 400 });
  }

  const project = await prisma.project.update({
    where: { id: ownedProject.project.id },
    data: { name: input.name },
  });

  return Response.json({ project });
}

export async function DELETE(_request: Request, context: ProjectRouteContext) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const ownedProject = await getOwnedProject(projectId, userId);

  if (ownedProject.response) {
    return ownedProject.response;
  }

  await prisma.project.delete({
    where: { id: ownedProject.project.id },
  });

  return new Response(null, { status: 204 });
}
