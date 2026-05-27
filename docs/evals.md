# ProdHub — Evals

## Phase 1 — Auth & Foundation

| # | Scenario | Steps | Pass | Fail |
|---|----------|-------|------|------|
| 1.1 | New user login | Complete Google OAuth | Row in users table, lands on home | Error, no row, duplicate row |
| 1.2 | Returning user | Sign in with same account | Same row, no duplicate | Second row with same email |
| 1.3 | Non-admin at /admin | Navigate directly | Redirected to home | Admin page renders |
| 1.4 | Unauthenticated at /tools | Navigate without login | Redirected to landing | Page renders with data |
| 1.5 | Deployed URL | Open in incognito | Landing page loads | 404 or build error |

## Phase 2 — Tools

| # | Scenario | Steps | Pass | Fail |
|---|----------|-------|------|------|
| 2.1 | All tools render | Navigate to /tools | All cards, no breaks | Missing cards |
| 2.2 | Category filter | Select Prioritization | Only those tools shown | Wrong or all tools |
| 2.3 | Search keyword | Type "RICE" | RICE card appears | No result or wrong |
| 2.4 | Expand card | Click any card | Full definition + example visible | Content missing |
| 2.5 | Mobile at 375px | View /tools narrow | Cards stack, no overflow | Horizontal scroll |
| 2.6 | No search results | Type "xyzabc" | Empty state shown | Blank or error |

## Phase 3 — Resources & Admin

| # | Scenario | Steps | Pass | Fail |
|---|----------|-------|------|------|
| 3.1 | Submit suggestion | Fill form, submit | Row in resource_suggestions, toast shown | No row, no feedback |
| 3.2 | Admin real-time | Submit in Tab A, watch Tab B | Appears in admin within 3s | Requires refresh |
| 3.3 | Approve without note | Click approve, leave note empty | Blocked, cannot confirm | Approves without note |
| 3.4 | Approve with note | Fill note, confirm | Appears on /resources with note | Not visible |
| 3.5 | Reject suggestion | Click reject | Removed from pending, not on resources | Still in pending |
| 3.6 | Resource type filter | Select Books | Only books shown | Wrong type or all |

## Phase 4 — Homepage, Rating, Resume Tips

| # | Scenario | Steps | Pass | Fail |
|---|----------|-------|------|------|
| 4.1 | Live count | Sign in on second window | Count in first window increments ≤3s | Static or refresh needed |
| 4.2 | Submit rating | Click 4 stars, confirm | Saved, aggregate updates without reload | No save, no update |
| 4.3 | Update rating | Submit 3, then submit 5 | Aggregate reflects 5, no duplicate row | Two rows same user |
| 4.4 | Resume Tips loads | Navigate to /resume-tips | Full content renders | Blank or broken |
| 4.5 | Analytics events | Complete tool view, resource click | Rows appear in events table | No rows |
| 4.6 | Full mobile pass | All pages at 375px | No horizontal scroll anywhere | Any page overflows |
