import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

const features = [
  "Map systems with an AI design partner.",
  "Collaborate on a shared technical canvas.",
  "Turn architecture into clear specifications.",
];

export function AuthPageLayout({
  children,
  title,
  description,
}: AuthPageLayoutProps) {
  return (
    <main className="min-h-dvh bg-base lg:grid lg:grid-cols-2">
      <section className="hidden border-r border-surface-border bg-surface px-12 py-10 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-copy-primary">
          <span className="flex size-8 items-center justify-center rounded-xl border border-surface-border bg-elevated font-mono text-sm font-semibold text-brand">
            G
          </span>
          <span className="text-sm font-semibold tracking-wide">Ghost AI</span>
        </div>

        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-brand">
            System design workspace
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-copy-primary">
            Design the system behind your next idea.
          </h1>
          <ul className="mt-8 space-y-3 text-sm leading-6 text-copy-secondary">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-copy-faint">Ghost AI</p>
      </section>

      <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-7 lg:hidden">
            <div className="flex items-center gap-3 text-copy-primary">
              <span className="flex size-8 items-center justify-center rounded-xl border border-surface-border bg-elevated font-mono text-sm font-semibold text-brand">
                G
              </span>
              <span className="text-sm font-semibold tracking-wide">Ghost AI</span>
            </div>
          </div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-copy-primary">
              {title}
            </h1>
            <p className="mt-2 text-sm text-copy-muted">{description}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
