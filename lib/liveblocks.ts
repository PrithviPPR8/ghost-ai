import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#52A8FF",
  "#BF7AF0",
  "#FF990A",
  "#FF6166",
  "#F75F8F",
  "#62C073",
  "#0AC7B4",
] as const;

declare global {
  var liveblocksClient: Liveblocks | undefined;
}

export function getCursorColor(userId: string) {
  let hash = 0;

  for (const character of userId) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  }

  return CURSOR_COLORS[(hash >>> 0) % CURSOR_COLORS.length];
}

export function getLiveblocksClient() {
  if (globalThis.liveblocksClient) {
    return globalThis.liveblocksClient;
  }

  const secret = process.env.LIVEBLOCKS_SECRET_KEY;

  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not configured");
  }

  const client = new Liveblocks({ secret });

  globalThis.liveblocksClient = client;

  return client;
}
