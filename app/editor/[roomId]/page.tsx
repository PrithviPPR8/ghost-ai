import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { CollaborativeCanvas } from "@/components/editor/collaborative-canvas";
import {
  getCurrentProjectIdentity,
  getProjectAccess,
} from "@/lib/project-access";

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const identity = await getCurrentProjectIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const { roomId } = await params;
  const project = await getProjectAccess(roomId, identity);

  if (!project) {
    return <AccessDenied />;
  }

  return (
    <section
      aria-label={`${project.name} architecture canvas`}
      className="h-[calc(100dvh-3.5rem)] bg-base"
    >
      <CollaborativeCanvas roomId={project.id} />
    </section>
  );
}
