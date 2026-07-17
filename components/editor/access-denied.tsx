import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export function AccessDenied() {
  return (
    <section className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <LockKeyhole className="mx-auto h-8 w-8 text-copy-muted" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-copy-primary">
          Workspace unavailable
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          This project does not exist or you do not have access to it.
        </p>
        <Link
          className="mt-6 inline-flex h-9 items-center rounded-xl bg-brand px-3 text-sm font-medium text-base transition-colors hover:bg-brand/80"
          href="/editor"
        >
          Back to projects
        </Link>
      </div>
    </section>
  );
}
