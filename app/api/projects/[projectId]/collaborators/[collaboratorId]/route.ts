import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface CollaboratorDeleteRouteContext {
  params: Promise<{ collaboratorId: string; projectId: string }>;
}

export async function DELETE(
  _request: Request,
  context: CollaboratorDeleteRouteContext,
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collaboratorId, projectId } = await context.params;
  const collaborator = await prisma.projectCollaborator.findFirst({
    where: { id: collaboratorId, projectId },
    select: { id: true, project: { select: { ownerId: true } } },
  });

  if (!collaborator) {
    return Response.json({ error: "Collaborator not found" }, { status: 404 });
  }

  if (collaborator.project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.projectCollaborator.delete({
    where: { id: collaborator.id },
  });

  return new Response(null, { status: 204 });
}
