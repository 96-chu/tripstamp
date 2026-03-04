# TripStamp

A cross-platform **travel check-in + photo journal** app:

- **Web:** React + TypeScript + Tailwind (Vite)
- **Mobile:** React Native (Expo)
- **Backend:** Supabase (Auth + Postgres + Storage)

This repo is a **monorepo**. Web and Mobile share the same business logic (schemas, types, API wrappers) via `packages/shared`.

---

## Features (MVP)

- Destinations: create / list / update / delete
- Check-ins: add a visit record with notes + photos
- Photo gallery & timeline views (Web + Mobile)
- Supabase Storage for photo uploads
- Shared Zod schemas + TypeScript types across platforms

---

## Tech Stack

**Web**
- React + TypeScript (Vite)
- Tailwind CSS

**Mobile**
- React Native (Expo) + TypeScript

**Shared**
- Zod (validation + types)
- `@supabase/supabase-js`

**Tooling**
- pnpm workspaces
- Turborepo

---

## Repo Structure

```
tripstamp/
  apps/
    web/          # Vite React TS + Tailwind
    mobile/       # Expo React Native
  packages/
    shared/       # shared schemas/types/api helpers (platform-agnostic)
  turbo.json
  pnpm-workspace.yaml
```

---

## Prerequisites

- Node.js (LTS recommended)
- pnpm
- A Supabase project

Install pnpm if you don't have it:

```bash
npm i -g pnpm
```

---

## 1) Supabase Setup

### Create a project and get keys

In Supabase Dashboard:
- **Project Settings → API**
  - `Project URL`
  - `anon public key` (**do not** use `service_role` on client apps)

### Create tables (SQL)

Open **SQL Editor → New query**, run:

```sql
create extension if not exists "uuid-ossp";

create table if not exists public.destinations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  name text not null,
  country text,
  city text,
  tags text[] default '{}'::text[],
  cover_photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  destination_id uuid not null references public.destinations(id) on delete cascade,
  visited_at timestamptz not null,
  note text,
  photo_urls text[] default '{}'::text[],
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create index if not exists idx_destinations_user_id on public.destinations(user_id);
create index if not exists idx_checkins_user_id on public.checkins(user_id);
create index if not exists idx_checkins_destination_id on public.checkins(destination_id);
create index if not exists idx_checkins_visited_at on public.checkins(visited_at desc);
```

### Create Storage bucket

In **Storage → New bucket**:
- Name: `photos`
- MVP recommendation: **Public bucket** (you can harden it later)

> Tip: To avoid getting blocked early, you can keep RLS off for MVP first, then add Auth + RLS policies later.

---

## 2) Install Dependencies

From repo root:

```bash
pnpm install
```

---

## 3) Configure Environment Variables

### Web (Vite)

Create: `apps/web/.env.local`

```env
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Web client init is recommended at:

- `apps/web/src/lib/supabase.ts`

### Mobile (Expo)

Create: `apps/mobile/.env`

```env
EXPO_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Make sure Expo picks these up via:

- `apps/mobile/app.config.ts` (inject into `extra`)
- `apps/mobile/src/lib/supabase.ts` (create client from `Constants.expoConfig.extra`)

> After editing `.env`, restart dev servers.

---

## 4) Run the Apps

### Web

```bash
pnpm --filter web dev
```

Open the URL printed in the terminal (usually http://localhost:5173).

### Mobile (Expo)

```bash
pnpm --filter mobile start
```

- Press `i` for iOS simulator (macOS)
- Press `a` for Android emulator
- Or scan the QR code with Expo Go

---

## Shared Package

`packages/shared` is intended to contain:
- Zod schemas + inferred types
- platform-agnostic API wrappers (accept a Supabase client instance)
- shared utilities

Apps should only keep platform-specific code in:
- `apps/web/src/lib/*`
- `apps/mobile/src/lib/*`

---

## Scripts

From root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

(Exact tasks depend on per-app scripts.)

---

## Roadmap

- [ ] Auth (Supabase) + RLS policies (per-user data isolation)
- [ ] Photo upload flow (mobile camera + gallery)
- [ ] Web gallery (masonry) + timeline
- [ ] Map view (pins / clustering)
- [ ] Public share page (read-only)
- [ ] CI (GitHub Actions): lint + typecheck + build

---

## License

MIT
