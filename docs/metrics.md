# ProdHub — Metrics

## North Star Metric
**Weekly Active Learners (WAL)** — unique users who engage with at least one Tool or Resource in a 7-day window.

Captures core value: people actually learning, not just signing up. A user who signs in and bounces does not count.

---

## Metric Tiers

### Tier 1 — North Star
| Metric | Definition | Target (Month 3) |
|--------|-----------|------------------|
| Weekly Active Learners | Unique users with ≥1 tool/resource interaction in 7 days | 200 |

### Tier 2 — Product Health
| Metric | Definition | Target |
|--------|-----------|--------|
| Activation Rate | % of signed-up users who view ≥3 tools in first session | >50% |
| Resource Approval Rate | Approved suggestions / total submissions | >60% |
| Avg Session Depth | Avg tools viewed per session | >3 |
| Return Rate D7 | % of users returning within 7 days of signup | >30% |
| Rating Submission Rate | % of users who submit a star rating | >20% |

### Tier 3 — Operational
| Metric | Definition | Watch If |
|--------|-----------|----------|
| Spam Submission Rate | Rejected / total submissions | >40% |
| Admin Review Lag | Avg hours from submission to decision | >48h |
| Bounce by Section | % leaving each page without interaction | >70% on any page |
| Auth Drop-off | % who land on login but don't complete OAuth | >30% |

---

## What We Do Not Track
- Total signups, total page views, social shares — vanity
- Time-on-page — indistinguishable from confusion
- NPS at MVP — sample size too small before 500 users

---

## Instrumentation

```sql
CREATE TABLE events (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES users(id),
  event_name  text NOT NULL,
  properties  jsonb,
  created_at  timestamptz DEFAULT now()
);
```

### Events to Log
| Event | Trigger | Properties |
|-------|---------|------------|
| tool_viewed | User opens tool card | tool_id, category |
| resource_clicked | User clicks external link | resource_id, type |
| resource_submitted | User submits suggestion | has_url, type |
| rating_submitted | User submits or updates rating | score, is_update |
| session_start | User lands post-login | entry_page |
| search_performed | User types in search | query_length, results_count |

No PII in properties. No emails, no names.

---

## Review Cadence
- **Weekly:** WAL, Return Rate
- **Monthly:** Activation Rate, Resource Approval Rate
- **On-demand:** Spam Rate, Admin Review Lag

---

## V2 Metrics (Post-MVP, WAL > 500)
- Content Completion Rate — scroll tracking required
- Search-to-Click Rate — surfaces content gaps
- Resource Quality Score — weighted click rate per approved resource
