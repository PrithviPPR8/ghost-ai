"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isProjectSidebarOpen: boolean;
  onProjectSidebarToggle: () => void;
}

export function EditorNavbar({
  isProjectSidebarOpen,
  onProjectSidebarToggle,
}: EditorNavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center border-b border-surface-border bg-surface/95 px-4 backdrop-blur">
      <div className="flex flex-1 items-center">
        <Button
          aria-expanded={isProjectSidebarOpen}
          aria-label={
            isProjectSidebarOpen
              ? "Close projects sidebar"
              : "Open projects sidebar"
          }
          onClick={onProjectSidebarToggle}
          size="icon"
          variant="ghost"
        >
          {isProjectSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center" />
      <div className="flex flex-1 items-center justify-end" />
    </header>
  );
}
