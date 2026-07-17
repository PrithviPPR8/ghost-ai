"use client";

import { Copy, LoaderCircle, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Collaborator {
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
  id: string;
}

interface ShareDialogProps {
  isOwner: boolean;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  projectId: string;
}

async function readResponseError(response: Response) {
  const body: unknown = await response.json().catch(() => null);

  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }

  return "Unable to update project access.";
}

function CollaboratorAvatar({ collaborator }: { collaborator: Collaborator }) {
  const initials = (collaborator.displayName ?? collaborator.email)
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (collaborator.avatarUrl) {
    return (
      // Clerk controls this avatar URL; using an img avoids requiring a fixed image host allowlist.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt=""
        className="size-9 rounded-full border border-surface-border object-cover"
        src={collaborator.avatarUrl}
      />
    );
  }

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-medium text-copy-secondary">
      {initials || "?"}
    </div>
  );
}

export function ShareDialog({
  isOwner,
  onOpenChange,
  open,
  projectId,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[] | null>(
    null,
  );
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setCollaborators(null);
    setEmail("");
    setError(null);
    setIsCopied(false);

    let isActive = true;

    fetch(`/api/projects/${projectId}/collaborators`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await readResponseError(response));
        }

        const body: unknown = await response.json();

        if (
          !body ||
          typeof body !== "object" ||
          !("collaborators" in body) ||
          !Array.isArray(body.collaborators)
        ) {
          throw new Error("Unable to load collaborators.");
        }

        return body.collaborators as Collaborator[];
      })
      .then((nextCollaborators) => {
        if (isActive) {
          setCollaborators(nextCollaborators);
        }
      })
      .catch((loadError: unknown) => {
        if (isActive) {
          setCollaborators([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load collaborators.",
          );
        }
      })
    return () => {
      isActive = false;
    };
  }, [open, projectId]);

  async function inviteCollaborator(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setIsInviting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(await readResponseError(response));
      }

      const body: unknown = await response.json();

      if (
        !body ||
        typeof body !== "object" ||
        !("collaborator" in body) ||
        !body.collaborator
      ) {
        throw new Error("Unable to invite collaborator.");
      }

      setCollaborators((current) => [
        ...(current ?? []),
        body.collaborator as Collaborator,
      ]);
      setEmail("");
    } catch (inviteError) {
      setError(
        inviteError instanceof Error
          ? inviteError.message
          : "Unable to invite collaborator.",
      );
    } finally {
      setIsInviting(false);
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    setRemovingId(collaboratorId);
    setError(null);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(await readResponseError(response));
      }

      setCollaborators((current) =>
        current?.filter((collaborator) => collaborator.id !== collaboratorId) ??
          [],
      );
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove collaborator.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  async function copyProjectLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2_000);
    } catch {
      setError("Unable to copy the project link.");
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-w-md gap-5 rounded-3xl border border-surface-border bg-surface p-6 text-copy-primary shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-copy-primary">
            Share project
          </DialogTitle>
          <DialogDescription className="leading-6 text-copy-muted">
            {isOwner
              ? "Invite collaborators to work on this architecture."
              : "People who can access this architecture."}
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <form className="flex gap-2" onSubmit={inviteCollaborator}>
            <Input
              aria-label="Collaborator email"
              className="h-9 border-surface-border bg-elevated text-copy-primary placeholder:text-copy-faint"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              type="email"
              value={email}
            />
            <Button disabled={isInviting || !email.trim()} size="lg" type="submit">
              {isInviting ? <LoaderCircle className="animate-spin" /> : <UserPlus />}
              Invite
            </Button>
          </form>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-medium text-copy-primary">
              Collaborators
            </h3>
            <Button onClick={copyProjectLink} size="sm" variant="ghost">
              <Copy />
              {isCopied ? "Copied!" : "Copy link"}
            </Button>
          </div>

          {collaborators === null ? (
            <div className="flex min-h-24 items-center justify-center text-sm text-copy-muted">
              <LoaderCircle className="mr-2 animate-spin" />
              Loading collaborators...
            </div>
          ) : collaborators.length ? (
            <ul className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {collaborators.map((collaborator) => (
                <li
                  className="flex items-center gap-3 rounded-2xl border border-surface-border bg-elevated/70 p-3"
                  key={collaborator.id}
                >
                  <CollaboratorAvatar collaborator={collaborator} />
                  <div className="min-w-0 flex-1">
                    {collaborator.displayName && (
                      <p className="truncate text-sm font-medium text-copy-primary">
                        {collaborator.displayName}
                      </p>
                    )}
                    <p className="truncate text-sm text-copy-muted">
                      {collaborator.email}
                    </p>
                  </div>
                  {isOwner && (
                    <Button
                      aria-label={`Remove ${collaborator.email}`}
                      disabled={removingId === collaborator.id}
                      onClick={() => removeCollaborator(collaborator.id)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      {removingId === collaborator.id ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/40 p-5 text-center text-sm text-copy-muted">
              No collaborators yet.
            </div>
          )}
        </div>

        {error && <p className="text-sm text-error">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
