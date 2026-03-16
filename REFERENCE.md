# My First Web App — Reference Guide

> **Built with:** React · Vite · Supabase · Vercel  
> **Author:** Kailas Nair  
> **Date:** March 2026

---

## Executive Summary

This document describes how I built and deployed my first full-stack web application from scratch — a personalised Hyrox workout tracker that is live on the internet, accessible from any device, and backed by a real cloud database.

The app was first prototyped as an interactive Claude artifact, progressively enhanced with features, then converted into a production codebase. It was connected to a cloud database, pushed to GitHub, and deployed to a global hosting platform — all in a single session.

**What was built:** A Hyrox race tracker with Singles/Doubles mode, individual station times, running leg splits, Roxzone capture, and a cross-race comparison chart.

### The Stack

| Layer | Tool |
|---|---|
| Frontend (UI) | React + Vite |
| Database | Supabase (Postgres) |
| Version Control | Git + GitHub |
| Hosting | Vercel |
| Language | JavaScript (JSX) |
| Styling | Plain CSS with custom properties |

> 💡 **Cost: R0/month.** Supabase, GitHub, and Vercel all have free tiers that are more than sufficient for personal projects.

---

## Phase 1 — Design & Prototype in Claude

### Step 1: Build a working prototype as a Claude artifact

Before writing any production code, the entire app was built as an interactive artifact inside Claude. A Claude artifact is a self-contained HTML/JavaScript app that runs live in the browser inside the chat — no backend, no database, no deployment.

**What happened:**
- Described the concept: a Hyrox race tracker covering all 8 stations
- Claude generated a fully working single-file app with local browser storage
- Features were added iteratively: Singles/Doubles toggle, running leg splits, Roxzone time, station comparison charts
- Each change was a conversational request — no code was written manually

> 💡 **Key insight:** Prototyping in Claude lets you nail the user experience and data model before touching infrastructure. If you don't like the direction, just ask Claude to change it.

### Step 2: Decide on the production stack

| Tool | Why it was chosen |
|---|---|
| React + Vite | Industry-standard UI framework. Vite makes it fast to set up and run locally. |
| Supabase | Provides a real Postgres database with zero backend code. Free tier is generous. No server to manage. |
| GitHub | Stores your code safely in the cloud and acts as the bridge to Vercel for deployment. |
| Vercel | Connects to GitHub and deploys your app automatically. Free, fast, and global. |

---

## Phase 2 — Set Up the Database

### Step 3: Create a Supabase project

Supabase is a "Backend as a Service" platform. It provides a hosted Postgres database and an auto-generated REST API — without writing any server code.

**What was done:**
- Created a free account at [supabase.com](https://supabase.com)
- Created a new project (this provisions a dedicated Postgres database)
- Noted the **Project URL** and **Anon Key** from the API settings — these are the credentials the app uses to connect to the database

> 💡 **What is an Anon Key?** The Supabase anon key is a public API key designed to be used safely in frontend code. It controls what unauthenticated users can do, governed by Row Level Security policies. It is not a secret and is safe to include in your app.

### Step 4: Create the database table

A database table is equivalent to a spreadsheet — it has columns (fields) and rows (records). The `races` table was created by running SQL in the Supabase SQL Editor.

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

-- Row Level Security: allow all reads and writes (personal use)
alter table races enable row level security;

create policy "Allow all" on races
  for all using (true) with check (true);
```

**What each part means:**

| SQL element | What it does |
|---|---|
| `create table races` | Creates a new table called "races" |
| `id bigint ... primary key` | Auto-incrementing unique ID for each row |
| `created_at timestamptz default now()` | Automatically records when each race was saved |
| `text not null` | A text field that must have a value |
| `integer` | A whole number field (used for times in seconds) |
| `jsonb` | Stores complex nested data (splits, runs) as JSON |
| `enable row level security` | Turns on access control for the table |
| `create policy "Allow all"` | Permits all reads and writes (fine for a personal app with no auth) |

---

## Phase 3 — Build the Production App

### Step 5: Understand the project structure

```
hyrox-tracker/
├── index.html              ← Entry point — loads the app
├── vite.config.js          ← Build tool configuration
├── package.json            ← Lists all dependencies
├── .env                    ← Your credentials (never committed to Git)
├── .env.example            ← Safe template showing what .env needs
├── .gitignore              ← Tells Git which files to ignore
├── README.md               ← Setup and deploy instructions
├── REFERENCE.md            ← This file
└── src/
    ├── main.jsx            ← Mounts the React app into index.html
    ├── App.jsx             ← Root component: navigation + tab routing
    ├── index.css           ← All styling
    ├── lib/
    │   ├── supabase.js     ← Database client (uses .env credentials)
    │   ├── constants.js    ← Stations and runs data
    │   └── utils.js        ← Time formatting helpers
    └── components/
        ├── LogRace.jsx     ← The race logging form
        ├── History.jsx     ← Past races list
        ├── Compare.jsx     ← Station comparison bar charts
        ├── PBs.jsx         ← Personal bests summary
        └── TimeInput.jsx   ← Reusable mm:ss input component
```

### Step 6: Run the app locally

```bash
# Navigate into the project folder
cd hyrox-tracker

# Install all dependencies listed in package.json
npm install

# Start the local development server
npm run dev

# App is now running at:
# http://localhost:5173
```

> 💡 **What does `npm install` do?** npm (Node Package Manager) reads `package.json` and downloads all the libraries your app needs — React, Vite, Supabase client, etc. — into a folder called `node_modules`. Only needs to be done once per machine.

---

## Phase 4 — Version Control with Git & GitHub

### Step 7: Install Git

Git is version control software. It tracks every change to your code, lets you roll back to earlier versions, and bridges your local machine to GitHub and Vercel.

- Downloaded and installed Git from [git-scm.com](https://git-scm.com/downloads)
- Closed and reopened the terminal so the new installation was recognised
- Verified with: `git --version`

### Step 8: Configure Git identity

Git records who made each change. Before making your first commit, tell Git your name and email.

```bash
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
```

The `--global` flag means this applies to all repositories on your machine — you only need to do this once.

### Step 9: Initialise the repo and make the first commit

```bash
# Must be run from inside the project folder
git init

# Stage all files for committing
git add .

# Create the first snapshot of your code
git commit -m "initial commit"
```

| Command | What it does |
|---|---|
| `git init` | Creates a new Git repository in the current folder |
| `git add .` | Stages all files — marks them as ready to be committed |
| `git commit -m "..."` | Saves a snapshot of all staged files with a descriptive message |

### Step 10: Create a GitHub account and repository

GitHub is a cloud platform for hosting Git repositories. It stores your code safely online and is the source Vercel deploys from.

- Created a free account at [github.com](https://github.com)
- Created a new empty repo called `hyrox-tracker` (no initialisation checkboxes ticked)
- Generated a **Personal Access Token** under Settings → Developer Settings → Tokens (classic), with the `repo` scope — used instead of a password when pushing code

### Step 11: Push code to GitHub

```bash
# Connect your local repo to GitHub
git remote add origin https://github.com/YOUR-USERNAME/hyrox-tracker.git

# Rename the default branch to "main"
git branch -M main

# Push your code (use your PAT as the password when prompted)
git push -u origin main
```

> ⚠️ **Why a Personal Access Token instead of a password?** GitHub disabled password authentication for Git operations in 2021. A PAT is a token with specific permissions. Treat it like a password — don't share it.

---

## Phase 5 — Deploy to Vercel

### Step 12: Create a Vercel account and deploy

Vercel is a hosting platform optimised for React and Vite apps. It connects to GitHub and redeploys automatically every time you push new code.

1. Sign up at [vercel.com](https://vercel.com) using your Google account
2. Connect your GitHub account when prompted
3. Click **Add New Project** → select the `hyrox-tracker` repository
4. Add **Environment Variables** before deploying:

| Variable name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

5. Click **Deploy** — Vercel builds the app and issues a live URL within ~60 seconds

> 💡 **Why environment variables?** Credentials should never be committed to GitHub. Environment variables store them securely in Vercel's dashboard and inject them at build time. Your `.env` file is gitignored for exactly this reason.

---

## How It All Connects

| When you... | What happens |
|---|---|
| Open the app URL | Vercel serves the built React app from its global CDN |
| Log a race and click Save | React calls the Supabase API, which inserts a row into Postgres |
| Open the app on another device | The same app loads, fetches races from Supabase, shows your data |
| Push new code to GitHub | Vercel detects the push and automatically rebuilds and redeploys |

---

## Making Changes to the App

Now that the pipeline is set up, making changes is simple:

```bash
# 1. Make your changes in VS Code (code.visualstudio.com)

# 2. Test locally
npm run dev

# 3. When happy, commit and push
git add .
git commit -m "describe your change"
git push
```

Vercel automatically picks up the push and redeploys within ~30 seconds.

---

## The Repeatable Pattern for Future Apps

This React + Supabase + GitHub + Vercel stack works for almost any personal or small-team app. The pattern is always the same:

1. **Prototype in Claude** as an artifact to validate the idea and data model
2. **Ask Claude to generate** the production codebase with Supabase integration
3. **Create the Supabase table** using the SQL Claude provides
4. **Run locally** to confirm it works (`npm install` → `npm run dev`)
5. **Push to GitHub** (`git init` → `git add .` → `git commit` → `git push`)
6. **Deploy on Vercel** with environment variables added before deploying

> ✅ **Total time for this first app:** ~2 hours including learning Git from scratch, creating all accounts, and debugging. Future apps using this stack will be significantly faster.

---

## Glossary

| Term | Plain English |
|---|---|
| **React** | A JavaScript library for building user interfaces. You write components (reusable UI pieces) and React handles updating the screen when data changes. |
| **Vite** | A build tool that runs your React app locally and compiles it for production. |
| **npm** | Node Package Manager. Downloads and manages JavaScript libraries your app depends on. |
| **Supabase** | A hosted database service. Gives you a Postgres database and an API without running your own server. |
| **Postgres** | A powerful open-source relational database. Supabase runs Postgres under the hood. |
| **SQL** | Structured Query Language. The language used to create, query, and manage databases. |
| **JSONB** | A Postgres column type for storing JSON data. Used to store complex nested race splits. |
| **Row Level Security** | A Supabase feature that controls who can read or write each row. |
| **Environment variable** | A config value stored outside your code — in Vercel's dashboard, not in your files. |
| **Git** | Version control software. Tracks every change to your code. |
| **Commit** | A saved snapshot of your code at a point in time, with a message describing what changed. |
| **Repository (repo)** | A folder that Git is tracking, containing all your code and its full history. |
| **GitHub** | A cloud platform for hosting Git repositories. Also connects to Vercel for deployment. |
| **Personal Access Token** | A GitHub-generated token used instead of a password when pushing code from the terminal. |
| **Vercel** | A hosting platform that deploys your app to the web and redeploys on every Git push. |
| **CDN** | Content Delivery Network. Vercel serves your app from servers close to each user globally. |
| **localhost:5173** | The local address where your app runs during development. Not accessible on the internet. |
| **.env file** | A file containing your environment variables for local development. Never committed to Git. |
| **.gitignore** | A file listing paths Git should never track — including `node_modules` and `.env`. |
