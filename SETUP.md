# Setup Instructions

## 1. Install dependencies
```bash
npm install
```

## 2. Create your environment file
Copy `.env.example` to `.env` and fill in real values:
```bash
cp .env.example .env
```
Edit `.env`:
- `DASHBOARD_PASSWORD` — the password you'll use to log in
- `SESSION_SECRET` — any long random string (e.g. generate one with `openssl rand -hex 32`)
- `DATABASE_URL` — leave as `file:./dev.db` (local SQLite file)

## 3. Generate Prisma client and create the database
```bash
npx prisma generate
npx prisma migrate dev --name init
```
This creates `prisma/dev.db` (your local database file) and generates the Prisma client.

## 4. Run the dev server
```bash
npm run dev
```
Visit http://localhost:3000 — it'll redirect you to `/login`. Enter the password you set.

## What's here so far
- `/login` — password login
- `/dashboard` — task board (To Do / Doing / Done columns), add/update/delete tasks
- SQLite database, nothing to host or sign up for

## Not built yet (next phases)
- Reminders / notifications
- Notes / daily log page
- Portfolio (public side)

## Notes
- `prisma/dev.db` will be created locally and is gitignored — it's your personal data, don't commit it.
- If you ever want to move this online (not just local), swap `DATABASE_URL` to a Postgres/Supabase connection string — the Prisma schema barely needs to change.
