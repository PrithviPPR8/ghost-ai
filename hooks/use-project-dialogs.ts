"use client";

import { useMemo, useState } from "react";

export type ProjectAccess = "owned" | "shared";
export type ProjectDialogMode = "create" | "rename" | "delete" | null;

export interface MockProject {
  id: string;
  name: string;
  slug: string;
  access: ProjectAccess;
}

interface UseProjectDialogsResult {
  activeProject: MockProject | null;
  dialogMode: ProjectDialogMode;
  isLoading: boolean;
  projectName: string;
  projects: MockProject[];
  slugPreview: string;
  closeDialog: () => void;
  createProject: () => Promise<void>;
  deleteProject: () => Promise<void>;
  openCreateDialog: () => void;
  openDeleteDialog: (project: MockProject) => void;
  openRenameDialog: (project: MockProject) => void;
  renameProject: () => Promise<void>;
  setProjectName: (name: string) => void;
}

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function useProjectDialogs(
  initialProjects: MockProject[],
): UseProjectDialogsResult {
  const [projects, setProjects] = useState(initialProjects);
  const [dialogMode, setDialogMode] = useState<ProjectDialogMode>(null);
  const [activeProject, setActiveProject] = useState<MockProject | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const slugPreview = useMemo(() => createSlug(projectName), [projectName]);

  function closeDialog() {
    setDialogMode(null);
    setActiveProject(null);
    setProjectName("");
  }

  function openCreateDialog() {
    setActiveProject(null);
    setProjectName("");
    setDialogMode("create");
  }

  function openRenameDialog(project: MockProject) {
    setActiveProject(project);
    setProjectName(project.name);
    setDialogMode("rename");
  }

  function openDeleteDialog(project: MockProject) {
    setActiveProject(project);
    setProjectName("");
    setDialogMode("delete");
  }

  async function createProject() {
    const name = projectName.trim();

    if (!name) {
      return;
    }

    setIsLoading(true);
    try {
      setProjects((currentProjects) => [
        ...currentProjects,
        {
          id: crypto.randomUUID(),
          name,
          slug: createSlug(name),
          access: "owned",
        },
      ]);
      closeDialog();
    } finally {
      setIsLoading(false);
    }
  }

  async function renameProject() {
    const name = projectName.trim();

    if (!activeProject || !name) {
      return;
    }

    setIsLoading(true);
    try {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === activeProject.id
            ? { ...project, name, slug: createSlug(name) }
            : project,
        ),
      );
      closeDialog();
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteProject() {
    if (!activeProject) {
      return;
    }

    setIsLoading(true);
    try {
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== activeProject.id),
      );
      closeDialog();
    } finally {
      setIsLoading(false);
    }
  }

  return {
    activeProject,
    dialogMode,
    isLoading,
    projectName,
    projects,
    slugPreview,
    closeDialog,
    createProject,
    deleteProject,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    renameProject,
    setProjectName,
  };
}
