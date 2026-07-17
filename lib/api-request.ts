export interface ProjectNameInput {
  id?: string;
  name?: string;
}

export interface CollaboratorInviteInput {
  email: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isProjectId(value: string) {
  return (
    value.length <= 100 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  );
}

export async function readProjectNameInput(
  request: Request,
): Promise<ProjectNameInput | null> {
  try {
    const body: unknown = await request.json();

    if (
      !isRecord(body) ||
      ("id" in body &&
        (typeof body.id !== "string" || !isProjectId(body.id))) ||
      ("name" in body && typeof body.name !== "string")
    ) {
      return null;
    }

    return body;
  } catch {
    return null;
  }
}

export async function readCollaboratorInviteInput(
  request: Request,
): Promise<CollaboratorInviteInput | null> {
  try {
    const body: unknown = await request.json();

    if (!isRecord(body) || typeof body.email !== "string") {
      return null;
    }

    const email = body.email.trim().toLowerCase();

    if (
      email.length > 320 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return null;
    }

    return { email };
  } catch {
    return null;
  }
}
