# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Project API routes and editor-home persistence wiring are implemented; initial Prisma migration application remains blocked by the local Windows TLS provider.

## Current Goal

- Apply the initial Prisma migration from an environment where Prisma's schema engine can establish TLS, then verify project persistence end to end.

## Completed

- Design system: configured shadcn/ui with the dark theme tokens, added Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea, installed Lucide React, and added the shared `cn()` utility.
- Editor shell: added the fixed editor navbar with a project-sidebar toggle and a floating, tabbed project sidebar with empty states and a New Project action.
- Editor workspace integration: composed the editor navbar and project sidebar in a shared layout around the full-height editor surface.
- Project dialogs & editor home: added mocked create, rename, and delete project flows; live slug preview; owned-project sidebar actions; mobile sidebar backdrop; and the editor home empty state.
- Prisma schema and data layer: added `Project` and `ProjectCollaborator` models, their relationships and indexes, a cached Prisma singleton that selects Accelerate or the PostgreSQL adapter by URL, and the initial migration SQL.
- Project API routes: added authenticated list and create endpoints plus owner-protected rename and delete endpoints. Request names are validated, creation defaults to `Untitled Project`, and unauthenticated and non-owner mutations receive `401` and `403` responses respectively.
- Editor home persistence wiring: replaced mock sidebar data with server-rendered owned and shared project lists, added `useProjectActions` for create, rename, and delete mutations, and aligned generated project IDs with Liveblocks room IDs.

## In Progress

- Apply `20260714170000_init` once the local Prisma schema engine TLS issue is resolved or from a compatible environment.

## Next Up

- Verify project creation, rename, and deletion against the database after the initial migration is applied.

## Open Questions

- Prisma's Windows schema engine returns `P1011` (TLS security-package credentials unavailable) against the configured direct Prisma Postgres URL, although the direct PostgreSQL driver connection succeeds. Apply the committed migration from a compatible environment or repair the local Windows TLS provider.

## Architecture Decisions

- The editor workspace layout owns sidebar visibility state. The navbar and project sidebar remain controlled, reusable components.
- The existing shadcn dialog primitives provide the standard dialog pattern (title, description, and footer actions) and use the token-backed global theme.
- The editor layout fetches owned and shared projects server-side, while `useProjectActions` owns client-side dialog state and API mutations.
- Runtime database traffic uses `DATABASE_URL`; Prisma CLI commands prefer `DIRECT_URL` and otherwise convert Prisma Postgres's pooled hostname to its direct hostname for migrations and administration.
- The Prisma singleton is exposed as the base generated client type so shared model delegates remain callable for both direct PostgreSQL and Accelerate connections.

## Session Notes

- Design system implementation completed on 2026-07-14. `npm run lint` and `npm run build` pass.
- Editor shell implementation completed on 2026-07-14. `npm run lint` and `npm run build` pass.
- Editor workspace integration completed on 2026-07-14. `npm run lint` and `npm run build` pass.
- Project dialogs & editor home completed on 2026-07-14. `npm run lint` and `npm run build` pass.
- Prisma schema and data layer implemented on 2026-07-14. `npx prisma generate`, `npm run lint`, and `npm run build` pass. Applying the migration is blocked locally by Prisma schema-engine TLS error `P1011`.
- Project API routes implemented on 2026-07-15. `npm run lint` and `npm run build` pass.
- Editor home persistence wiring implemented on 2026-07-16. `npm run lint` and `npm run build` pass.
