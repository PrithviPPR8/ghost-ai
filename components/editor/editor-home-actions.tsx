"use client";

import { Plus } from "lucide-react";

import { useProjectDialogActions } from "@/components/editor/project-dialog-context";
import { Button } from "@/components/ui/button";

export function EditorHomeActions() {
  const { openCreateDialog } = useProjectDialogActions();

  return (
    <Button className="mt-6" onClick={openCreateDialog} size="lg">
      <Plus />
      New Project
    </Button>
  );
}
