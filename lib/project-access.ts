import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export type ProjectAccess = "owned" | "shared";

export interface CurrentProjectIdentity {
  email: string | null;
  userId: string;
}

export interface AccessibleProject {
  access: ProjectAccess;
  id: string;
  name: string;
}

function getPrimaryEmail(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) {
    return null;
  }

  return (
    user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId,
    )?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null
  );
}

export async function getCurrentProjectIdentity(): Promise<CurrentProjectIdentity | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return {
    userId,
    email: getPrimaryEmail(await currentUser())?.toLowerCase() ?? null,
  };
}

export async function getProjectAccess(
  projectId: string,
  identity: CurrentProjectIdentity,
): Promise<AccessibleProject | null> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: identity.userId },
        ...(identity.email
          ? [{ collaborators: { some: { email: identity.email } } }]
          : []),
      ],
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
    },
  });

  if (!project) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
    access: project.ownerId === identity.userId ? "owned" : "shared",
  };
}
