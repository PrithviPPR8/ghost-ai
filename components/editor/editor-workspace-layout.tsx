"use client";

import { useState, type ReactNode } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogProvider } from "@/components/editor/project-dialog-context";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import {
  useProjectDialogs,
  type MockProject,
} from "@/hooks/use-project-dialogs";

interface EditorWorkspaceLayoutProps {
  children: ReactNode;
}

const MOCK_PROJECTS: MockProject[] = [
  {
    id: "realtime-collaboration",
    name: "Realtime collaboration",
    slug: "realtime-collaboration",
    access: "owned",
  },
  {
    id: "event-pipeline",
    name: "Event pipeline",
    slug: "event-pipeline",
    access: "owned",
  },
  {
    id: "shared-payment-platform",
    name: "Payment platform",
    slug: "payment-platform",
    access: "shared",
  },
];

export function EditorWorkspaceLayout({ children }: EditorWorkspaceLayoutProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);
  const projectDialogs = useProjectDialogs(MOCK_PROJECTS);

  return (
    <ProjectDialogProvider
      value={{
        openCreateDialog: projectDialogs.openCreateDialog,
        openDeleteDialog: projectDialogs.openDeleteDialog,
        openRenameDialog: projectDialogs.openRenameDialog,
      }}
    >
      <div className="min-h-dvh bg-base">
        <EditorNavbar
          isProjectSidebarOpen={isProjectSidebarOpen}
          onProjectSidebarToggle={() =>
            setIsProjectSidebarOpen((isOpen) => !isOpen)
          }
        />
        {isProjectSidebarOpen && (
          <button
            aria-label="Close projects sidebar"
            className="fixed inset-0 z-30 bg-base/70 backdrop-blur-sm md:hidden"
            onClick={() => setIsProjectSidebarOpen(false)}
            type="button"
          />
        )}
        <ProjectSidebar
          isOpen={isProjectSidebarOpen}
          onClose={() => setIsProjectSidebarOpen(false)}
          onCreate={projectDialogs.openCreateDialog}
          onDelete={projectDialogs.openDeleteDialog}
          onRename={projectDialogs.openRenameDialog}
          projects={projectDialogs.projects}
        />
        <main className="min-h-dvh pt-14">{children}</main>
        <ProjectDialogs
          activeProject={projectDialogs.activeProject}
          dialogMode={projectDialogs.dialogMode}
          isLoading={projectDialogs.isLoading}
          onClose={projectDialogs.closeDialog}
          onCreate={projectDialogs.createProject}
          onDelete={projectDialogs.deleteProject}
          onProjectNameChange={projectDialogs.setProjectName}
          onRename={projectDialogs.renameProject}
          projectName={projectDialogs.projectName}
          slugPreview={projectDialogs.slugPreview}
        />
      </div>
    </ProjectDialogProvider>
  );
}
