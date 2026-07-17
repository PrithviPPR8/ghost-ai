import { getCurrentProjectIdentity, getProjectAccess } from "@/lib/project-access";
import { readCollaboratorInviteInput } from "@/lib/api-request";
import { getProjectCollaborators } from "@/lib/project-collaborators";
import { prisma } from "@/lib/prisma";

interface CollaboratorRouteContext {
  params: Promise<{ projectId: string }>;
}

async function getAccessibleProject(projectId: string) {
  const identity = await getCurrentProjectIdentity();

  if (!identity) {
    return { identity: null, project: null, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const project = await getProjectAccess(projectId, identity);

  if (!project) {
    return { identity, project: null, response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { identity, project, response: null };
}

export async function GET(_request: Request, context: CollaboratorRouteContext) {
  const { projectId } = await context.params;
  const accessibleProject = await getAccessibleProject(projectId);

  if (accessibleProject.response) {
    return accessibleProject.response;
  }

  const collaborators = await getProjectCollaborators(projectId);

  return Response.json({ collaborators });
}

export async function POST(request: Request, context: CollaboratorRouteContext) {
  const { projectId } = await context.params;
  const accessibleProject = await getAccessibleProject(projectId);

  if (accessibleProject.response) {
    return accessibleProject.response;
  }

  if (accessibleProject.project.access !== "owned") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const input = await readCollaboratorInviteInput(request);

  if (!input) {
    return Response.json({ error: "A valid email address is required" }, { status: 400 });
  }

  if (input.email === accessibleProject.identity.email?.toLowerCase()) {
    return Response.json({ error: "The project owner already has access" }, { status: 400 });
  }

  try {
    await prisma.projectCollaborator.create({
      data: { projectId, email: input.email },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return Response.json({ error: "This collaborator already has access" }, { status: 409 });
    }

    throw error;
  }

  const collaborators = await getProjectCollaborators(projectId);
  const collaborator = collaborators.find(({ email }) => email === input.email);

  return Response.json({ collaborator }, { status: 201 });
}
