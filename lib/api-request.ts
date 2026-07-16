export interface ProjectNameInput {
  id?: string;
  name?: string;
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
