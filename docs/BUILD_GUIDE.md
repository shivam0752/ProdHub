# ProdHub — Complete Build Guide

---

## PHASE 0 — Prerequisites (Do this before writing any code)

### 0.1 Accounts needed
- GitHub account
- Vercel account (sign up with GitHub)
- Supabase account (supabase.com)
- Google Cloud Console account (console.cloud.google.com)

### 0.2 Tools to install locally
```bash
node --version        # needs to be v18+
npm --version         # comes with node
git --version         # needs to be installed
```

---

## PHASE 1 — Supabase Setup

### 1.1 Create the project
1. Go to supabase.com → New Project
2. Name: `prodhub`
3. Region: Southeast Asia (Singapore) — closest to India
4. Set a strong DB password, save it
5. Wait ~2 minutes for provisioning

### 1.2 Configure Google OAuth
1. Supabase dashboard → Authentication → Providers → Google → Toggle ON
2. Open a new tab: console.cloud.google.com
3. New Project → name it `prodhub`
4. APIs & Services → OAuth consent screen → External → fill app name + your email → Save
5. APIs & Services → Credentials → Create Credentials → OAuth Client ID → Web Application
6. Name: `prodhub-web`
7. Authorized redirect URIs: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   (find your project ID in Supabase Settings → General)
8. Copy Client ID and Client Secret → paste into Supabase Google provider → Save

### 1.3 Run the schema — SQL Editor → New Query → paste and run:
```sql
-- USERS
create table public.users (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null unique,
  name        text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

-- TOOLS
create table public.tools (
  id          uuid default gen_random_uuid() primary key,
  category    text not null,
  title       text not null,
  definition  text not null,
  example     text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- RESOURCES
create table public.resources (
  id             uuid default gen_random_uuid() primary key,
  type           text not null check (type in ('PRD','case_study','link','book')),
  title          text not null,
  url            text,
  description    text,
  editorial_note text not null,
  tags           text[],
  approved       boolean default true,
  created_at     timestamptz default now()
);

-- RESOURCE SUGGESTIONS
create table public.resource_suggestions (
  id            uuid default gen_random_uuid() primary key,
  submitted_by  uuid references public.users(id) on delete set null,
  title         text not null,
  url           text,
  description   text,
  type          text check (type in ('PRD','case_study','link','book')),
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz default now()
);

-- RATINGS
create table public.ratings (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.users(id) on delete cascade unique,
  score       integer not null check (score between 1 and 5),
  created_at  timestamptz default now()
);

-- SITE STATS
create table public.site_stats (
  id            integer primary key default 1 check (id = 1),
  total_users   integer default 0
);
insert into public.site_stats (id, total_users) values (1, 0);

-- EVENTS
create table public.events (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.users(id) on delete set null,
  event_name  text not null,
  properties  jsonb,
  created_at  timestamptz default now()
);
```

### 1.4 Run the triggers — New Query:
```sql
-- Auto-create user row on Google signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Increment total_users on new user row
create or replace function public.increment_user_count()
returns trigger as $$
begin
  update public.site_stats set total_users = total_users + 1 where id = 1;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_user_row_created
  after insert on public.users
  for each row execute function public.increment_user_count();

-- Auto-update updated_at on tools
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tools_updated_at
  before update on public.tools
  for each row execute function public.handle_updated_at();
```

### 1.5 Run RLS policies — New Query:
```sql
alter table public.users             enable row level security;
alter table public.tools             enable row level security;
alter table public.resources         enable row level security;
alter table public.resource_suggestions enable row level security;
alter table public.ratings           enable row level security;
alter table public.site_stats        enable row level security;
alter table public.events            enable row level security;

-- USERS
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "admin_select_all_users" on public.users
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- TOOLS
create policy "tools_select_authenticated" on public.tools
  for select using (auth.role() = 'authenticated');

create policy "tools_write_admin" on public.tools
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- RESOURCES
create policy "resources_select_approved" on public.resources
  for select using (auth.role() = 'authenticated' and approved = true);

create policy "resources_admin_all" on public.resources
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- RESOURCE SUGGESTIONS
create policy "suggestions_insert_own" on public.resource_suggestions
  for insert with check (auth.uid() = submitted_by);

create policy "suggestions_select_own" on public.resource_suggestions
  for select using (auth.uid() = submitted_by);

create policy "suggestions_admin_all" on public.resource_suggestions
  for all using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- RATINGS
create policy "ratings_select_all" on public.ratings
  for select using (auth.role() = 'authenticated');

create policy "ratings_insert_own" on public.ratings
  for insert with check (auth.uid() = user_id);

create policy "ratings_update_own" on public.ratings
  for update using (auth.uid() = user_id);

-- SITE STATS
create policy "site_stats_select_all" on public.site_stats
  for select using (true);

-- EVENTS
create policy "events_insert_own" on public.events
  for insert with check (auth.uid() = user_id);

create policy "events_admin_select" on public.events
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );
```

### 1.6 Enable Realtime
Dashboard → Database → Replication → enable for:
- `site_stats`
- `resource_suggestions`

### 1.7 Get your keys
Dashboard → Settings → API → copy:
- Project URL
- anon / public key (safe for frontend)

---

## PHASE 2 — Local Project Setup

### 2.1 Scaffold the project
```bash
npm create vite@latest prodhub -- --template react-ts
cd prodhub
npm install
```

### 2.2 Install dependencies
```bash
npm install @supabase/supabase-js
npm install react-router-dom
npm install zustand
npm install react-hot-toast
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2.3 Configure Tailwind
In `tailwind.config.js`:
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
```

In `src/index.css` replace everything with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2.4 Create .env file in project root
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2.5 Create .gitignore entry — confirm .env is in it
```
.env
.env.local
```

### 2.6 Create the Supabase client
`src/lib/supabaseClient.ts`:
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 2.7 Create folder structure
```bash
mkdir -p src/components src/pages src/hooks src/store src/constants src/types
```

### 2.8 Create the auth store
`src/store/authStore.ts`:
```ts
import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  role: 'user' | 'admin' | null
  setUser: (user: User | null) => void
  setRole: (role: 'user' | 'admin' | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
}))
```

### 2.9 Create the auth hook
`src/hooks/useAuth.ts`:
```ts
import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, role, setUser, setRole } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchRole(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchRole(session.user.id)
        else setRole(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchRole(userId: string) {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    if (data) setRole(data.role as 'user' | 'admin')
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { user, role, signInWithGoogle, signOut }
}
```

### 2.10 Set up routing
`src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Resources from './pages/Resources'
import ResumeTips from './pages/ResumeTips'
import Admin from './pages/Admin'
import Login from './pages/Login'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { role } = useAuth()
  return role === 'admin' ? <>{children}</> : <Navigate to="/" />
}

export default function App() {
  useAuth() // initialise auth listener at root

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/resume-tips" element={<ProtectedRoute><ResumeTips /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
```

### 2.11 Test locally
```bash
npm run dev
```
Open localhost:5173. You should see the app shell without crashing.

---

## PHASE 3 — GitHub + Vercel Deployment

### 3.1 Push to GitHub
```bash
git init
git add .
git commit -m "initial scaffold"
```
Go to github.com → New repository → name it `prodhub` → public or private
```bash
git remote add origin https://github.com/YOUR_USERNAME/prodhub.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy to Vercel
1. Go to vercel.com → New Project
2. Import your GitHub repo `prodhub`
3. Framework preset: Vite (auto-detected)
4. Environment variables — add both:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

### 3.3 Update Google OAuth redirect URI
Back in Google Cloud Console → Credentials → your OAuth Client:
Add to Authorized redirect URIs:
`https://your-vercel-url.vercel.app` (your actual Vercel domain)

Also update in Supabase: Authentication → URL Configuration → add your Vercel URL to Site URL and Redirect URLs.

### 3.4 Make yourself admin
After first sign-in via Google on the deployed app, run in Supabase SQL Editor:
```sql
update public.users
set role = 'admin'
where email = 'YOUR_GMAIL_HERE';
```

### 3.5 Verify deployment checklist
- [ ] Landing page loads on Vercel URL
- [ ] Google OAuth completes, row appears in Supabase users table
- [ ] /admin redirects non-admin to home
- [ ] Your account can access /admin after role update
- [ ] No .env values visible in browser network tab

---

## PHASE 4 — Build Order Per Phase

### Phase 1 done when:
All items in 2.6–2.10 work end to end on the deployed URL.

### Phase 2 — Tools section build order:
1. Create `src/constants/tools.ts` — seed all 20+ tools as a typed array
2. Create `src/hooks/useTools.ts` — fetches from Supabase tools table
3. Seed tools into Supabase via SQL insert or Supabase Table Editor
4. Build `src/components/ToolCard.tsx`
5. Build `src/pages/Tools.tsx` with filter + search
6. Test all evals from Phase 2

### Phase 3 — Resources + Admin build order:
1. Build `src/hooks/useResources.ts`
2. Build `src/components/ResourceCard.tsx`
3. Build `src/components/SubmissionPanel.tsx`
4. Build `src/pages/Resources.tsx`
5. Build `src/hooks/useAdmin.ts` — suggestions + approval logic
6. Build `src/pages/Admin.tsx` with Realtime subscription
7. Test all evals from Phase 3

### Phase 4 — Polish build order:
1. Build `src/components/LiveCount.tsx` — Realtime subscription to site_stats
2. Build `src/components/StarRating.tsx` — upsert to ratings
3. Build `src/pages/ResumeTips.tsx` — static content
4. Add analytics event logging to all relevant components
5. Add SEO meta tags in index.html
6. Full mobile pass — test every page at 375px
7. Test all evals from Phase 4

---

## PHASE 5 — Pre-Launch Checklist

### Code
- [ ] No console.log or console.error in production code
- [ ] No hardcoded keys anywhere in src/
- [ ] All routes tested authenticated and unauthenticated
- [ ] All 22 eval scenarios passing

### Supabase
- [ ] RLS enabled on all 7 tables
- [ ] Realtime enabled on site_stats and resource_suggestions
- [ ] At least 20 tools seeded
- [ ] At least 5 resources seeded with editorial notes
- [ ] Your account has role = admin

### Vercel
- [ ] Both env variables set in Vercel project settings
- [ ] Custom domain configured if you have one (optional)
- [ ] Preview deployments working on PR branches

### Content
- [ ] All seeded tools have Indian product examples
- [ ] All seeded resources have editorial notes
- [ ] Resume Tips page has India-specific content (not just US advice)
- [ ] About / landing page makes authorship clear — built by an aspiring PM, for aspiring PMs

---

## Post-Launch — Week 1 Actions
1. Share in NextLeap cohort group with the same honest framing as the survey message
2. Post on LinkedIn — same tone, not "I built a thing", but "I validated a problem, built for it, here's what I learned"
3. Check Supabase events table daily for the first week — what are people actually doing?
4. Check resource_suggestions — are people submitting? What are they submitting?
5. After 4 weeks of real usage, revisit the unique feature question with actual behavioural data
