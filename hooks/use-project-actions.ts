"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { EditorProject } from "@/lib/projects";

export type ProjectDialogMode = "create" | "rename" | "delete" | null;

interface UseProjectActionsResult {
  activeProject: EditorProject | null;
  dialogMode: ProjectDialogMode;
  isLoading: boolean;
  projectName: string;
  roomIdPreview: string;
  closeDialog: () => void;
  createProject: () => Promise<void>;
  deleteProject: () => Promise<void>;
  openCreateDialog: () => void;
  openDeleteDialog: (project: EditorProject) => void;
  openRenameDialog: (project: EditorProject) => void;
  renameProject: () => Promise<void>;
  setProjectName: (name: string) => void;
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "project"
  );
}

function createShortUniqueSuffix() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 8);
}

function createRoomId(name: string, suffix: string) {
  return `${slugify(name)}-${suffix}`;
}

async function readError(response: Response) {
  const body: unknown = await response.json().catch(() => null);

  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }

  return "Unable to update the project.";
}

export function useProjectActions(): UseProjectActionsResult {
  const pathname = usePathname();
  const router = useRouter();
  const [dialogMode, setDialogMode] = useState<ProjectDialogMode>(null);
  const [activeProject, setActiveProject] = useState<EditorProject | null>(null);
  const [projectName, setProjectName] = useState("");
  const [roomIdSuffix, setRoomIdSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const roomIdPreview = useMemo(
    () => createRoomId(projectName, roomIdSuffix || "xxxxxxxx"),
    [projectName, roomIdSuffix],
  );

  function closeDialog() {
    setDialogMode(null);
    setActiveProject(null);
    setProjectName("");
    setRoomIdSuffix("");
  }

  function openCreateDialog() {
    setActiveProject(null);
    setProjectName("");
    setRoomIdSuffix(createShortUniqueSuffix());
    setDialogMode("create");
  }

  function openRenameDialog(project: EditorProject) {
    setActiveProject(project);
    setProjectName(project.name);
    setRoomIdSuffix("");
    setDialogMode("rename");
  }

  function openDeleteDialog(project: EditorProject) {
    setActiveProject(project);
    setProjectName("");
    setRoomIdSuffix("");
    setDialogMode("delete");
  }

  async function createProject() {
    const name = projectName.trim();

    if (!name) {
      return;
    }

    const id = createRoomId(name, roomIdSuffix || createShortUniqueSuffix());
    setIsLoading(true);

    try {
      setErrorMessage(null);
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      closeDialog();
      router.push(`/editor/${id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Unable to create the project.");
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
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      closeDialog();
      router.refresh();
    } catch (error) {
      console.error(error);
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
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const activeWorkspacePath = `/editor/${activeProject.id}`;
      closeDialog();

      if (pathname === activeWorkspacePath) {
        router.replace("/editor");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    activeProject,
    dialogMode,
    isLoading,
    projectName,
    roomIdPreview,
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
