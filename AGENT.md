# Sambat Implementation Tracker

## Working Agreement

- Implement Sambat through small reviewable milestones.
- Stop after each completed milestone so the user can inspect the result.
- Before stopping, update this file with progress, verification, decisions, and the next milestone.
- Keep `System.md` as the product planning source.

## MVP Decisions

| Area | Decision |
| --- | --- |
| Queue | Redis + BullMQ |
| First chat channel | Telegram |
| Complaint statuses | `DITERIMA`, `DIPROSES`, `DITINDAKLANJUTI`, `SELESAI` |
| Public data policy | Anonymous strict |
| Attachment storage | Supabase Storage |
| Attachment rules | Image-only, multi attachment, max 5 MB per image |
| Admin bootstrap | Env-based superadmin seed |
| WhatsApp | Deferred until Telegram MVP flow is stable |

## Milestones

| Milestone | Status | Review Gate |
| --- | --- | --- |
| 0. Checkpoint tracker | Completed | `AGENT.md` records implementation checkpoints and defaults |
| 1. Project foundation | Completed | Monorepo scaffold, workspace scripts, env examples, shared config boundaries |
| 2. Data and auth core | Completed | Prisma schema, enums, RBAC/auth foundation, superadmin seed path |
| 3. Complaint API core | Completed | Complaint/agency APIs, anonymous public DTOs, image upload storage and validation |
| 4. Queue and AI pipeline | Completed | BullMQ flow, Gemini classification path, retry/failure/idempotency points |
| 5. Telegram intake | Completed | Telegram complaint and image intake routed through shared pipeline |
| 6. Admin web surfaces | Pending | Login, admin complaint views, status updates, follow-up creation |
| 7. Public and realtime surfaces | Pending | Anonymous public timeline/feed and Socket.IO updates |
| 8. Hardening and deployment prep | Pending | Security, audit/logging, env/deployment notes, build verification |

## Current Progress

### Completed

- Created the checkpoint tracker required before implementation milestones begin.
- Recorded the agreed MVP decisions and review gates.
- Scaffolded the PNPM/Turborepo workspace with root scripts and shared TypeScript configuration.
- Added minimal NestJS API, Next.js web app with Tailwind/PostCSS wiring, and TypeScript worker entrypoint.
- Added shared `config`, `shared`, and `types` packages plus an environment example for later services.
- Added `@sambat/database` with Prisma 7 config, PostgreSQL schema, generated client boundary, and env-driven superadmin seed script.
- Added shared role, source, priority, complaint status, and notification status enums.
- Added API database service, user lookup service, JWT login/profile endpoints, global auth guard, public route decorator, and RBAC role decorator/guard.
- Added agency create/list API foundations with superadmin and agency-admin role gates.
- Added complaint web intake, admin list/update endpoints, and anonymous public list/detail endpoints.
- Added shared admin/public complaint response types and presenter mapping that excludes sender and raw message from public responses when no AI summary exists.
- Added Supabase Storage upload service and image attachment validation for multi-image uploads with image-only and 5 MB per-file limits.
- Added BullMQ queue contracts and API producer for new web complaints with stable complaint job IDs.
- Added worker queue setup for incoming complaints, AI classification, auto reply, notification, and analytics placeholder flows.
- Added Gemini structured classification service with Zod validation before persistence.
- Added AI persistence fields for reply and processed timestamp, agency-name matching, retry/backoff defaults, and AI idempotency short-circuiting once a complaint is classified.
- Added optional Telegraf startup in the API when `TELEGRAM_BOT_TOKEN` is configured.
- Added Telegram text intake, photo-with-caption intake, image-document-with-caption intake, image download size guards, and unsupported media replies.
- Refactored complaint creation so Telegram and web intake use the same storage, queue, and persistence path.

### Verification

- `AGENT.md` exists in the project root and contains the milestone checklist.
- `corepack pnpm install --no-frozen-lockfile` installed workspace dependencies and updated `pnpm-lock.yaml`.
- `corepack pnpm typecheck` passed across six workspace packages.
- `corepack pnpm build` passed for the API, web app, worker, and shared packages.
- Turbo verification in this environment used a local Corepack `pnpm` shim directory added to `PATH` because global `pnpm` is not installed.
- `corepack pnpm db:generate` generated the Prisma client from `packages/database/prisma/schema.prisma`.
- `prisma validate` passed for the database schema.
- `corepack pnpm typecheck` passed across seven workspace packages after the database/auth additions.
- `corepack pnpm build` passed across seven workspace packages after the database/auth additions.
- `corepack pnpm typecheck` passed after complaint, agency, public DTO, and attachment API additions.
- `corepack pnpm build` passed after complaint, agency, public DTO, and attachment API additions.
- `corepack pnpm db:generate` refreshed the Prisma client after AI persistence fields were added.
- `prisma validate` passed after AI schema additions.
- `corepack pnpm typecheck` passed after BullMQ and Gemini worker additions.
- `corepack pnpm build` passed after BullMQ and Gemini worker additions.
- `corepack pnpm typecheck` passed after Telegram intake additions.
- `corepack pnpm build` passed after Telegram intake additions.

### Open Items

- Final category taxonomy and agency mapping are not supplied yet; implementation will start with configurable seed data.
- Media retention policy remains unresolved until storage hardening work.
- Superadmin seed execution is not verified yet because this checkpoint does not provision or connect a local PostgreSQL database.
- Complaint runtime and Supabase upload behavior are not exercised end-to-end yet because this checkpoint does not provision PostgreSQL or Supabase Storage credentials.
- Queue and AI runtime behavior are not exercised end-to-end yet because this checkpoint does not start Redis or call Gemini with real credentials.
- Telegram bot runtime is not exercised end-to-end yet because this checkpoint does not use a live Telegram bot token.

## Review Gate

Milestone 5 is ready for review:

- Telegram module in `apps/api/src/telegram`.
- Shared complaint creation path in `apps/api/src/complaints`.
- Telegram env surface in `.env.example`.

## Next Milestone

Milestone 6 will add admin web surfaces:

- admin login
- superadmin and agency complaint views
- status update workflow
- follow-up report creation surface
