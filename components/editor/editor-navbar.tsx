"use client";

import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Share2,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isAiSidebarOpen: boolean;
  isProjectSidebarOpen: boolean;
  onAiSidebarToggle: () => void;
  onProjectSidebarToggle: () => void;
  onShare: () => void;
  projectName?: string;
}

export function EditorNavbar({
  isAiSidebarOpen,
  isProjectSidebarOpen,
  onAiSidebarToggle,
  onProjectSidebarToggle,
  onShare,
  projectName,
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
      <div className="flex min-w-0 flex-1 items-center justify-center px-4">
        {projectName && (
          <p className="truncate text-sm font-medium text-copy-primary">
            {projectName}
          </p>
        )}
      </div>
      <div className="flex flex-1 items-center justify-end">
        {projectName && (
          <>
            <Button aria-label="Share project" onClick={onShare} size="sm" variant="ghost">
              <Share2 />
              Share
            </Button>
            <Button
              aria-expanded={isAiSidebarOpen}
              aria-label={
                isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
              }
              onClick={onAiSidebarToggle}
              size="icon"
              variant="ghost"
            >
              {isAiSidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  );
}
