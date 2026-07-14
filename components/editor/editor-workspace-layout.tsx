"use client";

import { useState, type ReactNode } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";

interface EditorWorkspaceLayoutProps {
  children: ReactNode;
}

export function EditorWorkspaceLayout({ children }: EditorWorkspaceLayoutProps) {
  const [isProjectSidebarOpen, setIsProjectSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-base">
      <EditorNavbar
        isProjectSidebarOpen={isProjectSidebarOpen}
        onProjectSidebarToggle={() =>
          setIsProjectSidebarOpen((isOpen) => !isOpen)
        }
      />
      <ProjectSidebar
        isOpen={isProjectSidebarOpen}
        onClose={() => setIsProjectSidebarOpen(false)}
      />
      <main className="min-h-dvh pt-14">{children}</main>
    </div>
  );
}
