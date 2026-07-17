import { prisma } from "@/lib/prisma";
import { getCurrentProjectIdentity } from "@/lib/project-access";
import type { ProjectAccess } from "@/lib/project-access";

export type { ProjectAccess } from "@/lib/project-access";

export interface EditorProject {
  access: ProjectAccess;
  id: string;
  name: string;
}

export async function getCurrentUserProjects(): Promise<{
  ownedProjects: EditorProject[];
  sharedProjects: EditorProject[];
}> {
  const identity = await getCurrentProjectIdentity();

  if (!identity) {
    return { ownedProjects: [], sharedProjects: [] };
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: identity.userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
    identity.email
      ? prisma.project.findMany({
          where: { collaborators: { some: { email: identity.email } } },
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
  ]);

  return {
    ownedProjects: ownedProjects.map((project) => ({ ...project, access: "owned" })),
    sharedProjects: sharedProjects.map((project) => ({ ...project, access: "shared" })),
  };
}
