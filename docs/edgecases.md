# ProdHub — Edge Cases

## Anticipated

### Auth
- User revokes Google permissions → session expires, user sees login, DB row persists, re-login continues existing account
- Different Google account → new user row, no merging
- Admin on new device → role is in DB not JWT, RLS handles it, no risk of role loss

### Resource Submissions
- Same URL submitted twice → no dedup at MVP, admin sees both, add unique constraint post-MVP if spam grows
- Broken URL submitted → format validation only, admin checks before approving
- Spam wave → admin rejects, rate limit (one per user per hour) in V2 if needed
- Resource goes offline after approval → no automated link checking, out of scope for MVP

### Editorial Notes
- Admin approves without editorial note → blocked at UI level, required field before confirmation
- Editorial note is lazy/generic → admin's judgment call, no automated quality check at MVP

### Ratings
- Tab closed mid-submission → acceptable loss at this scale
- Second rating from same user → upsert on user_id, updates not duplicates
- All users give 1 star → aggregate displays honestly, no floor

### Real-Time
- Realtime connection drops → display last known count, live indicator turns grey — never show stale count as live
- Count trigger fails → falls back to COUNT query on page load

### Admin
- Two admins approve same suggestion simultaneously → last write wins, acceptable at MVP scale
- Admin accidentally rejects genuine submission → no undo at MVP, user can resubmit

---

## Discovered During Build

| Date | Phase | Edge Case | Resolution |
|------|-------|-----------|------------|
| — | — | — | — |
