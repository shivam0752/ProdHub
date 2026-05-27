# ProdHub — Decisions

## Format: decision → why → what was rejected

**Google OAuth only — no email/password**
We do not store passwords. The target user (product professionals) will not be blocked by requiring Google. Reduces auth attack surface to near zero.

**Supabase over Firebase**
Real Postgres database, typed queries, built-in RLS. Firebase is a document store requiring workarounds for relational data. Supabase free tier sufficient for MVP.

**No custom backend server**
Supabase handles auth, DB, real-time. An Express/Node layer adds deployment complexity and cost with zero benefit at this scale. Revisit post-MVP if complex server-side logic is needed.

**Zustand over Redux**
Redux is overkill for two stores. Zustand has no boilerplate, works cleanly with TypeScript, no middleware needed at this scale.

**No unique AI feature at MVP**
User survey (23 responses, May 2026) revealed anxiety and content gaps — not a broken repeated action a tool can solve. Building a chatbot wrapper to address "I don't know if I'm thinking like a PM" is not a product, it's a prompt. Ship clean, observe real usage for 4 weeks, let the feature emerge from behaviour not assumptions.

**Ship without unique feature rather than ship a weak one**
A hobbled or gimmicky feature signals poor product judgment — the exact thing a PM portfolio should not demonstrate. A clean, well-curated, trustworthy resource hub is more valuable than a forced differentiator.

**Indian PM market as primary focus, not global**
Generic PM hubs compete with Reforge and Lenny's Newsletter. The Indian PM market has no dedicated trustworthy resource. Narrow focus makes curation defensible and the audience specific.

**Tool examples use Indian company context**
RICE scoring explained through a Swiggy feature decision is more useful to the target user than a generic Silicon Valley example. Indian context throughout — not as a gimmick, as genuine relevance.

**Editorial notes required on every approved resource**
A link list is not a product. Every resource includes one sentence explaining why it belongs — not what it is, but why. This is the trust signal and the hardest thing to replicate. Admin cannot approve without writing one.

**Transparent authorship**
Built by an aspiring PM for aspiring PMs. Not a disclaimer — a positioning statement. The curator has the same problem as the user. That is the honest and correct framing. Inauthenticity is the risk, not lack of seniority.

**FMHY-style curation model**
Users suggest, admin approves, nothing gets in without a reason. No sponsored placements, no affiliate links. Editorial gate is what makes the list trustworthy. Signal-to-noise ratio over volume.

**Admin role stored in DB not JWT**
Role changes take effect immediately. JWT claim storage would require token expiry or forced re-auth on role change.

**One rating per user, updatable**
Multiple ratings per user inflates the score. One upsert per user keeps it honest while allowing users to change their mind.

**resource_suggestions separate from resources table**
Raw user input must never appear on the public-facing page before admin review. Clean separation of user-generated vs admin-approved content.

**Vercel over Netlify**
Better React/Vite defaults, zero-config GitHub deployments, preview URLs per branch.
