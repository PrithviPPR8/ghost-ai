"use client";

import { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { MockProject, ProjectDialogMode } from "@/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  activeProject: MockProject | null;
  dialogMode: ProjectDialogMode;
  isLoading: boolean;
  projectName: string;
  slugPreview: string;
  onClose: () => void;
  onCreate: () => Promise<void>;
  onDelete: () => Promise<void>;
  onRename: () => Promise<void>;
  onProjectNameChange: (name: string) => void;
}

const dialogContentClassName = "rounded-3xl border-surface-border bg-surface p-6";
const dialogFooterClassName =
  "-mx-6 -mb-6 rounded-b-3xl border-surface-border bg-elevated/60 px-6 py-4";

function ProjectNameField({
  autoFocus = false,
  onChange,
  value,
}: {
  autoFocus?: boolean;
  onChange: (name: string) => void;
  value: string;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-copy-secondary" htmlFor="project-name">
        Project name
      </label>
      <Input
        autoFocus={autoFocus}
        id="project-name"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Architecture workspace"
        value={value}
      />
    </div>
  );
}

function submitForm(
  event: FormEvent<HTMLFormElement>,
  action: () => Promise<void>,
) {
  event.preventDefault();
  void action();
}

export function ProjectDialogs({
  activeProject,
  dialogMode,
  isLoading,
  projectName,
  slugPreview,
  onClose,
  onCreate,
  onDelete,
  onRename,
  onProjectNameChange,
}: ProjectDialogsProps) {
  const isCreateOpen = dialogMode === "create";
  const isRenameOpen = dialogMode === "rename";
  const isDeleteOpen = dialogMode === "delete";

  return (
    <>
      <Dialog onOpenChange={(open) => !open && onClose()} open={isCreateOpen}>
        <DialogContent className={dialogContentClassName}>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>
              Give your architecture workspace a clear, memorable name.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(event) => submitForm(event, onCreate)}>
            <ProjectNameField
              onChange={onProjectNameChange}
              value={projectName}
            />
            <p className="mt-3 text-sm text-copy-muted">
              Slug preview: <span className="font-mono text-copy-secondary">{slugPreview || "project-slug"}</span>
            </p>
            <DialogFooter className={dialogFooterClassName}>
              <DialogClose render={<Button disabled={isLoading} type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button disabled={!projectName.trim() || isLoading} type="submit">
                Create project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={(open) => !open && onClose()} open={isRenameOpen}>
        <DialogContent className={dialogContentClassName}>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Rename {activeProject?.name ?? "this project"}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(event) => submitForm(event, onRename)}>
            <ProjectNameField
              autoFocus
              onChange={onProjectNameChange}
              value={projectName}
            />
            <DialogFooter className={dialogFooterClassName}>
              <DialogClose render={<Button disabled={isLoading} type="button" variant="outline" />}>
                Cancel
              </DialogClose>
              <Button disabled={!projectName.trim() || isLoading} type="submit">
                Rename project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={(open) => !open && onClose()} open={isDeleteOpen}>
        <DialogContent className={dialogContentClassName}>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              Delete {activeProject?.name ?? "this project"}? This mock action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={dialogFooterClassName}>
            <DialogClose render={<Button disabled={isLoading} type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button disabled={isLoading} onClick={() => void onDelete()} variant="destructive">
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
