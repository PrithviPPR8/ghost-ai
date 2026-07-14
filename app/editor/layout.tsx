import { EditorWorkspaceLayout } from "@/components/editor/editor-workspace-layout";

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <EditorWorkspaceLayout>{children}</EditorWorkspaceLayout>;
}
