# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Canvas node resizing, inline label editing, and the predefined node color toolbar are complete; the initial Prisma migration application remains blocked by the local Windows TLS provider.

## Current Goal

- Continue with the next scoped canvas feature.

## Completed

- Design system: configured shadcn/ui with the dark theme tokens, added Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea, installed Lucide React, and added the shared `cn()` utility.
- Editor shell: added the fixed editor navbar with a project-sidebar toggle and a floating, tabbed project sidebar with empty states and a New Project action.
- Editor workspace integration: composed the editor navbar and project sidebar in a shared layout around the full-height editor surface.
- Project dialogs & editor home: added mocked create, rename, and delete project flows; live slug preview; owned-project sidebar actions; mobile sidebar backdrop; and the editor home empty state.
- Prisma schema and data layer: added `Project` and `ProjectCollaborator` models, their relationships and indexes, a cached Prisma singleton that selects Accelerate or the PostgreSQL adapter by URL, and the initial migration SQL.
- Project API routes: added authenticated list and create endpoints plus owner-protected rename and delete endpoints. Request names are validated, creation defaults to `Untitled Project`, and unauthenticated and non-owner mutations receive `401` and `403` responses respectively.
- Editor home persistence wiring: replaced mock sidebar data with server-rendered owned and shared project lists, added `useProjectActions` for create, rename, and delete mutations, and aligned generated project IDs with Liveblocks room IDs.
- Editor workspace shell: added server-side project access validation for `/editor/[roomId]`, an access-denied state for unavailable projects, and the project-context workspace placeholders for the canvas and future AI chat.
- Share dialog: added project-scoped collaborator APIs, owner-only invite and removal actions, Clerk-backed display-name and avatar enrichment with email fallbacks, and a workspace share dialog with read-only collaborator access and project-link copying.
- Liveblocks setup: added typed cursor and thinking presence, user metadata, a cached server client with deterministic cursor colors, and a project-membership-protected auth route that creates private rooms idempotently and returns a project-scoped session token.
- Base canvas: replaced the workspace placeholder with a server-composed, Liveblocks-backed React Flow canvas using room-scoped authentication, empty synchronized node and edge state, loose connections, a minimap, and a dot-pattern background.
- Node-shape rendering and drag preview: replaced the placeholder renderer with CSS rectangle, pill, and circle variants plus scalable SVG diamond, hexagon, and cylinder variants. Selected nodes use brighter borders, and shape-panel drags show a cursor-attached preview without changing collaborative node creation.
- Canvas node connection handles: added hover-revealed target handles on the top and left plus source handles on the right and bottom. The existing loose connection mode allows these handles to serve incoming and outgoing connections without changing node visuals or collaborative state.
- Canvas node editing: added selected-node resize controls with shared minimum dimensions, plus centered inline label editing with an empty-label placeholder. Label updates use the existing Liveblocks node-change flow as users type, while blur and Escape close the editor without canvas drag or pan interactions.
- Node color toolbar: added a floating palette above selected nodes. Each predefined swatch updates its paired background and text colors through the existing Liveblocks node-change flow, with active selection and a controlled text-color hover glow.

## In Progress

- Apply `20260714170000_init` once the local Prisma schema engine TLS issue is resolved or from a compatible environment.

## Next Up

- Continue with the next scoped canvas feature.
- Verify project creation, rename, deletion, and collaborator sharing against the database after the initial migration is applied.

## Open Questions

- Prisma's Windows schema engine returns `P1011` (TLS security-package credentials unavailable) against the configured direct Prisma Postgres URL, although the direct PostgreSQL driver connection succeeds. Apply the committed migration from a compatible environment or repair the local Windows TLS provider.

## Architecture Decisions

- The editor workspace layout owns sidebar visibility state. The navbar and project sidebar remain controlled, reusable components.
- The existing shadcn dialog primitives provide the standard dialog pattern (title, description, and footer actions) and use the token-backed global theme.
- The editor layout fetches owned and shared projects server-side, while `useProjectActions` owns client-side dialog state and API mutations.
- Runtime database traffic uses `DATABASE_URL`; Prisma CLI commands prefer `DIRECT_URL` and otherwise convert Prisma Postgres's pooled hostname to its direct hostname for migrations and administration.
- The Prisma singleton is exposed as the base generated client type so shared model delegates remain callable for both direct PostgreSQL and Accelerate connections.
- Collaborator records are normalized to lowercase email addresses; the collaborator API enriches display data from Clerk at read time and keeps the database as the sole project-access store.
- The server workspace page continues to own access validation; the client canvas component is limited to Liveblocks room setup and React Flow synchronization.

## Session Notes

- Design system implementation completed on 2026-07-14. `npm run lint` and `npm run build` pass.
- Editor shell implementation completed on 2026-07-14. `npm run lint` and `npm run build` pass.
- Editor workspace integration completed on 2026-07-14. `npm run lint` and `npm run build` pass.
- Project dialogs & editor home completed on 2026-07-14. `npm run lint` and `npm run build` pass.
- Prisma schema and data layer implemented on 2026-07-14. `npx prisma generate`, `npm run lint`, and `npm run build` pass. Applying the migration is blocked locally by Prisma schema-engine TLS error `P1011`.
- Project API routes implemented on 2026-07-15. `npm run lint` and `npm run build` pass.
- Editor home persistence wiring implemented on 2026-07-16. `npm run lint` and `npm run build` pass.
- Editor workspace shell implemented on 2026-07-16. `npm run build` passes; `npm run lint` reports the pre-existing unused `errorMessage` warning in `hooks/use-project-actions.ts`.
- Share dialog implemented on 2026-07-16. `npm run build` passes.
- Liveblocks setup implemented on 2026-07-19. Targeted Liveblocks lint and `npm run build` pass. Full `npm run lint` remains blocked by the pre-existing synchronous state update error in `components/editor/share-dialog.tsx` and the unused `errorMessage` warning in `hooks/use-project-actions.ts`.
- Base canvas implemented on 2026-07-20. `npm run build` passes.
- Node-shape rendering and drag-preview implementation completed on 2026-07-22. `npm run build` compiles successfully and clears TypeScript checking.
- Canvas node connection handles implemented on 2026-07-22. `npm run build` passes.
- Canvas node resizing and inline label editing implemented on 2026-07-22. `npx tsc --noEmit` and `npm run build` pass.
- Node color toolbar implemented on 2026-07-22. `npx tsc --noEmit` and `npm run build` pass.
