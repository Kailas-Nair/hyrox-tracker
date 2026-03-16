# Hyrox Tracker

A personal Hyrox race tracker with Supabase persistence and Vercel hosting.

---

## Step 1 — Supabase: Create the database table

1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Run this SQL:

```sql
create table races (
  id          bigint generated always as identity primary key,
  created_at  timestamptz default now(),
  date        text        not null,
  location    text        not null,
  mode        text        not null default 'singles',
  r1name      text,
  r2name      text,
  total       integer     not null,
  roxzone     integer     default 0,
  splits      jsonb       not null default '{}',
  runs        jsonb       not null default '{}'
);

-- Allow public read/write (no auth — fine for personal use)
alter table races enable row level security;

create policy "Allow all" on races
  for all using (true) with check (true);
```

---

## Step 2 — Local development

```bash
# Install dependencies
npm install

# Create your .env file (already done if you got this from Claude)
# Otherwise copy .env.example → .env and fill in your Supabase credentials

# Run locally
npm run dev
```

App runs at http://localhost:5173

---

## Step 3 — Deploy to Vercel

### Option A: Via GitHub (recommended)

1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "initial"
   gh repo create hyrox-tracker --public --push
   ```
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Click **Deploy** — done. You'll get a live URL.

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel
# Follow prompts, then add env vars in the Vercel dashboard
```

---

## Notes

- `.env` is gitignored — your keys will NOT be committed to GitHub
- The Supabase anon key is safe to use in frontend code (it's designed for this)
- No authentication is set up — this is a personal tracker, all data is shared under one table
- To add auth later, wrap App.jsx with Supabase Auth UI and add user_id to the races table

---

## Tech stack

| Layer    | Tool      |
|----------|-----------|
| Frontend | React + Vite |
| Database | Supabase (Postgres) |
| Hosting  | Vercel |
| Fonts    | Barlow Condensed (Google Fonts) |
