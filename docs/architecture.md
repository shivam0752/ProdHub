# ProdHub — Architecture

## System Shape

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Zustand
- **Hosting:** Vercel

### Backend / BaaS
- **Platform:** Supabase
- No custom backend server. Supabase handles auth, database, real-time, and storage via client SDK and Row Level Security.

### Authentication
- Google OAuth only via Supabase Auth
- Data captured at signup: email, full name, avatar URL
- No passwords stored. Ever.

### Database Schema (Supabase / PostgreSQL)

**users**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | references auth.users |
| email | text | unique |
| name | text | from Google profile |
| avatar_url | text | from Google profile |
| role | text | 'user' or 'admin' |
| created_at | timestamptz | |

**tools**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| category | text | Prioritization, Metrics, Frameworks etc |
| title | text | |
| definition | text | plain English |
| example | text | Indian product context where possible |
| created_at | timestamptz | |
| updated_at | timestamptz | auto-updated via trigger |

**resources**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| type | text | PRD, case_study, link, book |
| title | text | |
| url | text | |
| description | text | |
| editorial_note | text | why this belongs here — required |
| tags | text[] | |
| approved | boolean | default true (admin-inserted only) |
| created_at | timestamptz | |

**resource_suggestions**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| submitted_by | uuid | references users |
| title | text | |
| url | text | |
| description | text | |
| type | text | |
| status | text | pending, approved, rejected |
| created_at | timestamptz | |

**ratings**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| user_id | uuid | unique — one per user |
| score | integer | 1–5 |
| created_at | timestamptz | |

**site_stats**
| Column | Type | Notes |
|--------|------|-------|
| id | integer | always 1 — single row |
| total_users | integer | updated by trigger |

**events** (analytics)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| user_id | uuid | |
| event_name | text | |
| properties | jsonb | no PII |
| created_at | timestamptz | |

### Key Data Flows
1. User lands → Google OAuth → Supabase creates auth user → trigger creates users row → trigger increments site_stats
2. User submits resource → inserts into resource_suggestions → admin sees real-time notification → approves/rejects → approval copies to resources with editorial note
3. User submits rating → upsert on user_id → aggregate displayed on homepage
4. Homepage → Supabase Realtime subscription on site_stats → live user count

### Third-Party Services
- **Supabase** — auth, DB, real-time (free tier sufficient for MVP)
- **Vercel** — hosting and CI/CD (free tier)
- **Google OAuth** — via Supabase's built-in provider

### What We Are Deliberately Not Using
- No custom Express/Node backend
- No Redux
- No separate CMS
- No email service at MVP
- No AI API at MVP — observe real usage first
