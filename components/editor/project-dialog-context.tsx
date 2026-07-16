"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { EditorProject } from "@/lib/projects";

interface ProjectDialogActions {
  openCreateDialog: () => void;
  openDeleteDialog: (project: EditorProject) => void;
  openRenameDialog: (project: EditorProject) => void;
}

const ProjectDialogContext = createContext<ProjectDialogActions | null>(null);

export function ProjectDialogProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ProjectDialogActions;
}) {
  return (
    <ProjectDialogContext.Provider value={value}>
      {children}
    </ProjectDialogContext.Provider>
  );
}

export function useProjectDialogActions() {
  const context = useContext(ProjectDialogContext);

  if (!context) {
    throw new Error(
      "useProjectDialogActions must be used within a ProjectDialogProvider.",
    );
  }

  return context;
}
