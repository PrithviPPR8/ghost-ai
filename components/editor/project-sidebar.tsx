"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MockProject } from "@/hooks/use-project-dialogs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  onDelete: (project: MockProject) => void;
  onRename: (project: MockProject) => void;
  projects: MockProject[];
}

function EmptyProjectState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/40 p-6 text-center text-sm text-copy-muted">
      {children}
    </div>
  );
}

function ProjectList({
  onDelete,
  onRename,
  projects,
}: Pick<ProjectSidebarProps, "onDelete" | "onRename" | "projects">) {
  if (!projects.length) {
    return <EmptyProjectState>No projects yet.</EmptyProjectState>;
  }

  return (
    <ul className="space-y-2" aria-label="Projects">
      {projects.map((project) => (
        <li
          className="flex items-center gap-2 rounded-xl border border-surface-border bg-elevated/60 p-2"
          key={project.id}
        >
          <div className="min-w-0 flex-1 px-1">
            <p className="truncate text-sm font-medium text-copy-primary">
              {project.name}
            </p>
            <p className="truncate font-mono text-xs text-copy-muted">
              {project.slug}
            </p>
          </div>
          {project.access === "owned" && (
            <div className="flex items-center gap-1">
              <Button
                aria-label={`Rename ${project.name}`}
                onClick={() => onRename(project)}
                size="icon-xs"
                variant="ghost"
              >
                <Pencil />
              </Button>
              <Button
                aria-label={`Delete ${project.name}`}
                onClick={() => onDelete(project)}
                size="icon-xs"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onCreate,
  onDelete,
  onRename,
  projects,
}: ProjectSidebarProps) {
  const ownedProjects = projects.filter((project) => project.access === "owned");
  const sharedProjects = projects.filter((project) => project.access === "shared");

  return (
    <aside
      aria-hidden={!isOpen}
      aria-label="Project navigation"
      inert={!isOpen}
      className={cn(
        "fixed top-16 bottom-4 left-4 z-40 flex w-80 max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-2xl backdrop-blur transition-transform duration-200 ease-out",
        isOpen
          ? "translate-x-0"
          : "pointer-events-none -translate-x-[calc(100%+1rem)]",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-copy-primary">Projects</h2>
        <Button
          aria-label="Close projects sidebar"
          onClick={onClose}
          size="icon-sm"
          variant="ghost"
        >
          <X />
        </Button>
      </div>

      <Tabs className="mt-6 min-h-0 flex-1" defaultValue="my-projects">
        <TabsList className="w-full bg-subtle">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent className="pt-4" value="my-projects">
          <ProjectList
            onDelete={onDelete}
            onRename={onRename}
            projects={ownedProjects}
          />
        </TabsContent>
        <TabsContent className="pt-4" value="shared">
          {sharedProjects.length ? (
            <ProjectList
              onDelete={onDelete}
              onRename={onRename}
              projects={sharedProjects}
            />
          ) : (
            <EmptyProjectState>No shared projects yet.</EmptyProjectState>
          )}
        </TabsContent>
      </Tabs>

      <Button className="mt-4 w-full" onClick={onCreate} size="lg">
        <Plus />
        New Project
      </Button>
    </aside>
  );
}
