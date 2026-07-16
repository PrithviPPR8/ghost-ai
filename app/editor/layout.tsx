import { EditorWorkspaceLayout } from "@/components/editor/editor-workspace-layout";
import { getCurrentUserProjects } from "@/lib/projects";

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { ownedProjects, sharedProjects } = await getCurrentUserProjects();

  return (
    <EditorWorkspaceLayout
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      {children}
    </EditorWorkspaceLayout>
  );
}
