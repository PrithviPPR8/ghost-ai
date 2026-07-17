"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogProvider } from "@/components/editor/project-dialog-context";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareDialog } from "@/components/editor/share-dialog";
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
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
  const projectActions = useProjectActions();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const pathname = usePathname();
  const projects = [...ownedProjects, ...sharedProjects];
  const activeProject = projects.find(
    (project) => pathname === `/editor/${project.id}`,
  );

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
          isAiSidebarOpen={isAiSidebarOpen}
          isProjectSidebarOpen={isProjectSidebarOpen}
          onAiSidebarToggle={() => setIsAiSidebarOpen((isOpen) => !isOpen)}
          onProjectSidebarToggle={() =>
            setIsProjectSidebarOpen((isOpen) => !isOpen)
          }
          onShare={() => setIsShareDialogOpen(true)}
          projectName={activeProject?.name}
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
          currentProjectId={activeProject?.id}
          isOpen={isProjectSidebarOpen}
          onClose={() => setIsProjectSidebarOpen(false)}
          onCreate={projectActions.openCreateDialog}
          onDelete={projectActions.openDeleteDialog}
          onRename={projectActions.openRenameDialog}
          projects={projects}
        />
        <main className="min-h-dvh pt-14">{children}</main>
        {activeProject && isAiSidebarOpen && (
          <aside
            aria-label="AI assistant"
            className="fixed top-16 right-4 bottom-4 z-40 flex w-80 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-2xl backdrop-blur"
          >
            <h2 className="text-base font-semibold text-copy-primary">
              AI Assistant
            </h2>
            <p className="mt-3 text-sm leading-6 text-copy-muted">
              AI chat will appear here in a future workspace update.
            </p>
          </aside>
        )}
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
        {activeProject && (
          <ShareDialog
            isOwner={activeProject.access === "owned"}
            onOpenChange={setIsShareDialogOpen}
            open={isShareDialogOpen}
            projectId={activeProject.id}
          />
        )}
      </div>
    </ProjectDialogProvider>
  );
}
