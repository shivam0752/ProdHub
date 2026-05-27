# ProdHub — Conventions

## Folder Structure
```
src/
  components/       # Reusable UI components
  pages/            # Route-level components
  hooks/            # Custom React hooks
  store/            # Zustand stores
  lib/              # Supabase client, utilities
  constants/        # Seeded tools content, category lists
  types/            # TypeScript interfaces
```

## Naming
- Components: PascalCase — ToolCard.tsx, ResourcePanel.tsx
- Hooks: camelCase with use prefix — useAuth.ts, useTools.ts
- Stores: camelCase with Store suffix — authStore.ts
- Constants: SCREAMING_SNAKE_CASE — MAX_RATING = 5
- Files: camelCase — supabaseClient.ts
- DB columns: snake_case — created_at, submitted_by

## Component Rules
- Functional components only
- Props interfaces defined above the component
- No inline styles — Tailwind only
- If Tailwind string exceeds 5 classes, extract to a const above return

## State Rules
- Local UI state → useState
- Auth state, user role → Zustand authStore
- Server data → custom hooks, not global store
- Never store derived data in Zustand

## Supabase Rules
- Single client instance in lib/supabaseClient.ts — never instantiate elsewhere
- All DB queries go through custom hooks — never directly in page components
- RLS is the security layer — frontend checks are UX only
- Never expose service role key on frontend
- Always destructure { data, error } — always check error before using data

## Error Handling
- User-facing errors → toast notification via react-hot-toast
- console.error acceptable in dev, removed before production
- Failed fetch on public page → static fallback, never blank page

## Libraries
**Use:** @supabase/supabase-js, zustand, react-router-dom v6, react-hot-toast, lucide-react
**Avoid:** Redux, Axios, Moment.js, any CSS-in-JS

## TypeScript
- Strict mode on
- No any types — use unknown and narrow
- Supabase types generated via CLI in types/supabase.ts
