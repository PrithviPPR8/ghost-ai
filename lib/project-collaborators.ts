import { clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface ProjectCollaboratorDetails {
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
  id: string;
}

function getDisplayName(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return name || user.username || null;
}

async function getUsersByEmail(emails: string[]) {
  try {
    const client = await clerkClient();
    const responses = await Promise.all(
      Array.from({ length: Math.ceil(emails.length / 100) }, (_, index) =>
        client.users.getUserList({
          emailAddress: emails.slice(index * 100, (index + 1) * 100),
          limit: 100,
        }),
      ),
    );

    return responses.flatMap((response) => response.data);
  } catch {
    return [];
  }
}

export async function getProjectCollaborators(
  projectId: string,
): Promise<ProjectCollaboratorDetails[]> {
  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true },
  });

  if (!collaborators.length) {
    return [];
  }

  const users = await getUsersByEmail(collaborators.map(({ email }) => email));
  const usersByEmail = new Map(
    users.flatMap((user) =>
      user.emailAddresses.map((emailAddress) => [
        emailAddress.emailAddress.toLowerCase(),
        user,
      ]),
    ),
  );

  return collaborators.map((collaborator) => {
    const user = usersByEmail.get(collaborator.email.toLowerCase());

    return {
      id: collaborator.id,
      email: collaborator.email,
      displayName: user ? getDisplayName(user) : null,
      avatarUrl: user?.imageUrl ?? null,
    };
  });
}
