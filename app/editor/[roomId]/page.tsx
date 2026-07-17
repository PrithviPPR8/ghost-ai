import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
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
    <section className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center bg-base px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-copy-primary">
          {project.name}
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          Your architecture canvas will appear here.
        </p>
      </div>
    </section>
  );
}
