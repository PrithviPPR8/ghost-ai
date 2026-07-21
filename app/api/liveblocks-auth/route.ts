import { currentUser } from "@clerk/nextjs/server";

import { getCursorColor, getLiveblocksClient } from "@/lib/liveblocks";
import {
  getCurrentProjectIdentity,
  getProjectAccess,
} from "@/lib/project-access";

interface LiveblocksAuthInput {
  room: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readLiveblocksAuthInput(
  request: Request,
): Promise<LiveblocksAuthInput | null> {
  try {
    const body: unknown = await request.json();

    if (
      !isRecord(body) ||
      typeof body.room !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.room) ||
      body.room.length > 100
    ) {
      return null;
    }

    return { room: body.room };
  } catch {
    return null;
  }
}

function getDisplayName(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) {
    return "Anonymous";
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return name || user.username || user.primaryEmailAddress?.emailAddress || "Anonymous";
}

export async function POST(request: Request) {
  const identity = await getCurrentProjectIdentity();

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = await readLiveblocksAuthInput(request);

  if (!input) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const project = await getProjectAccess(input.room, identity);

  if (!project) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const liveblocks = getLiveblocksClient();
    const user = await currentUser();
    const cursorColor = getCursorColor(identity.userId);

    await liveblocks.getOrCreateRoom(project.id, {
      defaultAccesses: [],
    });

    const session = liveblocks.prepareSession(identity.userId, {
      userInfo: {
        name: getDisplayName(user),
        avatar: user?.imageUrl ?? "",
        cursorColor,
      },
    });

    session.allow(project.id, ["*:write"]);

    const { body, status } = await session.authorize();

    return new Response(body, {
      status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json(
      { error: "Unable to authenticate with Liveblocks" },
      { status: 500 },
    );
  }
}
