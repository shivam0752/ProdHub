# ProdHub — Implementation Plan

## Phase 1 — Foundation & Auth (Week 1–2)
**Goal:** Working app skeleton with Google login and Supabase wired up end to end.

### Deliverables
- Vite + React project scaffolded and deployed to Vercel via GitHub
- Supabase project created, all tables defined with RLS policies
- Google OAuth configured in Supabase + Google Cloud Console
- Sign In with Google flow working end to end
- User row auto-created in users table on first login
- Basic nav shell: Home, Tools, Resources, Resume Tips, Admin (hidden unless role = admin)
- Protected routes — unauthenticated users redirected to landing page
- .env variables set up, not committed to Git

### Pass Criteria
- New Google account signs in → row appears in Supabase users table
- Existing user signs in again → no duplicate row
- /admin as non-admin → redirects to home
- Deployed Vercel URL publicly accessible

---

## Phase 2 — Tools Section (Week 3–4)
**Goal:** Core knowledge hub working with seeded content using Indian product examples.

### Deliverables
- Tools page with category filter: PM Fundamentals, Metrics, Frameworks, Prioritization, Stakeholder Management
- Each tool card: title, plain-English definition, one concrete example drawn from Indian companies (Swiggy, Zepto, Razorpay, CRED, Flipkart) wherever possible
- Expandable deep-dive per card
- At least 20 seeded tools across categories
- Search bar filtering by name or keyword
- Mobile-responsive layout

### Pass Criteria
- All 20+ tools render correctly on desktop and mobile (375px)
- Search returns correct results for 10 tested keywords
- Expanding a card shows full content without layout breaks
- Category filter shows only correct tools

---

## Phase 3 — Resources Section + Admin (Week 5–6)
**Goal:** Curated resource library with community submission flow and admin dashboard.

### Deliverables
- Resources page with type filter: PRDs, Case Studies, Links, Books
- Each resource card: title, type badge, description, editorial note, external link
- Right-side submission panel: title, URL, description, type fields
- Submission writes to resource_suggestions table
- Admin dashboard: pending suggestions list, approve/reject, real-time notification badge
- Approval: copies row to resources table, prompts admin to write editorial note before confirming
- Rejection: marks suggestion rejected, removed from pending

### Pass Criteria
- Submitting creates a row in resource_suggestions
- Admin sees it in real-time without page refresh
- Approving (with editorial note) makes it appear on Resources page
- Rejecting removes from pending without affecting live resources
- Editorial note is required field — cannot approve without it

---

## Phase 4 — Resume Tips, Stats & Polish (Week 7–8)
**Goal:** Final section, homepage live stats, ratings, full mobile pass.

### Deliverables
- Resume Tips page: static content — PM resume structure, keywords recruiters look for, common mistakes, Indian market specifics (what Flipkart/Swiggy/Zepto hiring looks for vs US-centric advice)
- Homepage: live user count via Supabase Realtime, star rating widget (1–5), aggregate score + review count
- Rating: one per user, updatable, upsert on user_id
- Full mobile responsiveness pass across all pages
- Basic SEO meta tags
- Analytics events firing for tool_viewed, resource_clicked, resource_submitted, rating_submitted

### Pass Criteria
- User count updates within 3 seconds of new signup (tested in two browser windows)
- Rating submits, aggregate updates without full page reload
- User can update their rating, aggregate reflects change correctly
- All pages pass 375px mobile viewport test with no horizontal scroll
- All 6 analytics events confirmed firing in Supabase events table
