"use client";

import { useState, type ReactNode } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogProvider } from "@/components/editor/project-dialog-context";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { EditorProject } from "@/lib/projects";

interface EditorWorkspaceLayoutProps {
  children: ReactNode;
  ownedProjects: EditorProject[];
  sharedProjects: EditorProject[];
}

export function EditorWorkspaceLayout({
  children,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceLayoutProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);
  const projectActions = useProjectActions();

  return (
    <ProjectDialogProvider
      value={{
        openCreateDialog: projectActions.openCreateDialog,
        openDeleteDialog: projectActions.openDeleteDialog,
        openRenameDialog: projectActions.openRenameDialog,
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
          onCreate={projectActions.openCreateDialog}
          onDelete={projectActions.openDeleteDialog}
          onRename={projectActions.openRenameDialog}
          projects={[...ownedProjects, ...sharedProjects]}
        />
        <main className="min-h-dvh pt-14">{children}</main>
        <ProjectDialogs
          activeProject={projectActions.activeProject}
          dialogMode={projectActions.dialogMode}
          isLoading={projectActions.isLoading}
          onClose={projectActions.closeDialog}
          onCreate={projectActions.createProject}
          onDelete={projectActions.deleteProject}
          onProjectNameChange={projectActions.setProjectName}
          onRename={projectActions.renameProject}
          projectName={projectActions.projectName}
          roomIdPreview={projectActions.roomIdPreview}
        />
      </div>
    </ProjectDialogProvider>
  );
}
