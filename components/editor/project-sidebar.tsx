"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function EmptyProjectState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/40 p-6 text-center text-sm text-copy-muted">
      {children}
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      aria-label="Project navigation"
      inert={!isOpen}
      className={cn(
        "fixed top-16 bottom-4 left-4 z-40 flex w-80 flex-col rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-2xl backdrop-blur transition-transform duration-200 ease-out",
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
          <EmptyProjectState>No projects yet.</EmptyProjectState>
        </TabsContent>
        <TabsContent className="pt-4" value="shared">
          <EmptyProjectState>No shared projects yet.</EmptyProjectState>
        </TabsContent>
      </Tabs>

      <Button className="mt-4 w-full" size="lg">
        <Plus />
        New Project
      </Button>
    </aside>
  );
}
