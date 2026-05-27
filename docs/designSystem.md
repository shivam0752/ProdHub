# ProdHub — Design System v2.0

> Updated after UI build · Light Theme · Validated against 3 shipped screens

---

## Philosophy

**Structured confidence.** The visual language of a PM who thinks clearly and writes precisely. Neo-brutalist in its honesty — visible structure, no decoration for its own sake — but filtered through a professional light-mode lens.

Three principles govern every decision:

1. **Hierarchy over decoration.** Contrast, weight, and scale carry meaning. Color is an accent, not a crutch. If you removed all color, the hierarchy should still be readable.
2. **Surfaces are layered, not flat.** Page background → card surface → elevated element. Three levels. Never more. Never fewer.
3. **Every border earns its place.** Borders communicate containment or separation. A border that does neither should not exist.

---

## Color Tokens

### Brand Palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-brand-navy` | `#0F2D52` | Primary — logo, headings, hero backgrounds, sidebar, CTA fills |
| `--color-brand-accent` | `#2563EB` | Interactive — links, active states, focus rings, left border accents |
| `--color-brand-punch` | `#F59E0B` | Focal — stats, ratings, category highlights. Max 2 uses per screen |
| `--color-brand-positive` | `#10B981` | Live indicator, success states, approved badges |
| `--color-brand-danger` | `#EF4444` | Errors, destructive actions only |

### Neutral Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-0` | `#FFFFFF` | Card surfaces, nav background, input fill |
| `--color-neutral-50` | `#F7F6F2` | Page background — warm off-white, not cold grey |
| `--color-neutral-100` | `#EDEDEA` | List box backgrounds, skeleton states |
| `--color-neutral-200` | `#E8E7E2` | Default borders, dividers, hairlines |
| `--color-neutral-300` | `#D1D5DB` | Filter pill borders, inactive controls |
| `--color-neutral-400` | `#9CA3AF` | Placeholder text, captions, labels, secondary nav |
| `--color-neutral-600` | `#6B7280` | Body text, card descriptions |
| `--color-neutral-800` | `#374151` | Strong body text, list items |
| `--color-neutral-900` | `#111111` | Headings, high-contrast text |

### Category Badge Colors

Each tool category has a fixed color. Never mix these.

| Category | Background | Text | Border |
|----------|-----------|------|--------|
| Prioritization | `#FFFBEB` | `#B45309` | `#FDE68A` |
| Metrics | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` |
| Frameworks | `#F0FDF4` | `#15803D` | `#BBF7D0` |
| Stakeholder Mgmt | `#FDF4FF` | `#7E22CE` | `#E9D5FF` |
| PM Fundamentals | `#FFF7ED` | `#C2410C` | `#FED7AA` |

### Dark Surface Palette (Hero, Sidebar, Live Card)

Used only on `--color-brand-navy` backgrounds:

| Element | Value |
|---------|-------|
| Primary text | `#FFFFFF` |
| Secondary text | `rgba(255,255,255,0.55)` |
| Muted text | `rgba(255,255,255,0.35)` |
| Divider | `rgba(255,255,255,0.10)` |
| Icon fill | `#93B4F7` |
| Section label | `rgba(255,255,255,0.40)` |

### Usage Rules
- `--color-brand-navy` is the only color allowed as a full-surface background. No other brand color fills large areas.
- `--color-brand-punch` (amber) is capped at 2 visible uses per screen — stats and ratings only.
- Never use `--color-brand-accent` as a background fill. It is for text, borders, and icons only.
- Semantic colors (`--positive`, `--danger`) are for state signals only, never decoration.
- The page background is `#F7F6F2` — warm off-white. Never pure `#F5F5F5` or cold grey. The warmth reduces eye fatigue for reading sessions.

---

## Typography

### Font Stack
```css
--font-display: 'DM Sans', sans-serif;      /* All headings, nav, labels, badges */
--font-body:    'DM Sans', sans-serif;       /* Body text, descriptions */
--font-mono:    'IBM Plex Mono', monospace;  /* Codes, formulas, eyebrows, stat values */
```

DM Sans for everything. IBM Plex Mono for anything that needs to feel systematic — stat numbers, category eyebrows, formula chips, timestamps, badge labels.

### Type Scale

| Level | Size | Weight | Line Height | Font | Usage |
|-------|------|--------|-------------|------|-------|
| `display` | 30–38px | 800 | 1.08 | DM Sans | Hero headlines only. Letter-spacing: -0.02em |
| `h1` | 26px | 800 | 1.15 | DM Sans | Page titles. Letter-spacing: -0.02em |
| `h2` | 20px | 700 | 1.2 | DM Sans | Section headings |
| `h3` | 15px | 700 | 1.3 | DM Sans | Card titles, subsection headers |
| `h4` | 13px | 700 | 1.4 | DM Sans | List box titles, widget headers |
| `body-lg` | 14px | 400 | 1.7 | DM Sans | Lead descriptions under page titles |
| `body` | 13px | 400 | 1.65 | DM Sans | Card body, default reading text |
| `body-sm` | 12px | 400 | 1.6 | DM Sans | List items, helper text, captions |
| `label` | 11px | 500 | 1.5 | DM Sans | Nav items, filter pills, form labels |
| `mono-lg` | 16–36px | 500 | 1.0 | IBM Plex Mono | Stat values, live counts |
| `mono-sm` | 9–10px | 500 | 1.5 | IBM Plex Mono | Eyebrows, badge text, timestamps — always uppercase + letter-spacing: 0.10em |

### Rules
- Display and h1 always use `letter-spacing: -0.02em`. Tight tracking at large sizes.
- `mono-sm` is always uppercase. No exceptions.
- Body text color is `--color-neutral-600`. Never pure black for paragraph text.
- Headings on white backgrounds: `--color-neutral-900`.
- Headings on navy backgrounds: `#FFFFFF`.
- Line length cap: 65 characters for body text. Beyond this, comprehension drops.

---

## Spacing

Base unit: **4px**. All spacing values are multiples of 4.

```
4px   — xs    Icon-to-label gaps, tight inline spacing
6px   — xs+   Badge internal padding, chip gaps
8px   — sm    Within-component spacing
10px  — sm+   Card internal gaps, list item gaps
12px  — md    Between related elements, grid gaps
14px  — md+   Filter row gaps, form element spacing
16px  — lg    Default component padding
18–20px — lg+ Card padding (horizontal)
24px  — xl    Section internal padding, hero padding
28–32px — 2xl Major block separation
36px  — 3xl   Page body padding (horizontal)
48px  — 4xl   Hero padding, large section breaks
```

**Rule:** Never use a value not in this scale. 10px and 20px are in the scale. 15px, 22px, 25px are not.

---

## Surfaces & Elevation

Three levels. No shadows. Elevation is communicated through background contrast and border weight.

| Level | Background | Border | Usage |
|-------|-----------|--------|-------|
| Page | `#F7F6F2` | None | The base layer. Everything sits on this. |
| Card | `#FFFFFF` | `0.5px solid #E8E7E2` | Default cards, nav bar, input fields |
| Nested | `#F9FAFB` | `0.5px solid #F3F4F6` | List boxes inside cards, inner sections |
| Dark surface | `#0F2D52` | None | Hero, live card, sidebar keyword card |

**No box-shadows.** If an element needs to feel elevated, use the background contrast between levels. Shadow implies floating — ProdHub elements are grounded.

---

## Border System

```css
--border-hairline:  0.5px solid #E8E7E2;   /* Default card, nav, input borders */
--border-medium:    0.5px solid #D1D5DB;   /* Filter pills, secondary elements */
--border-emphasis:  1px solid #0F2D52;     /* Active/selected states */
--border-accent:    2px solid #2563EB;     /* Focus rings, featured items */
--border-left-idle: 3px solid #E8E7E2;     /* Tool card left accent — resting */
--border-left-hover:3px solid #2563EB;     /* Tool card left accent — hover */
```

**The 0.5px rule:** All default borders are 0.5px. This is intentional — hairline borders communicate structure without adding visual weight. The only exception is `--border-accent` (2px) for focus states and featured items.

---

## Border Radius

```css
--radius-none:  0px      /* Filter pills, category badges, mono chips — sharp corners signal utility */
--radius-sm:    4px      /* Formula chips, small tags */
--radius-md:    6px      /* Buttons, icon containers, chevron boxes */
--radius-lg:    8px      /* Search bar, filter containers */
--radius-card:  10px     /* All cards — the default card radius */
--radius-full:  9999px   /* Avatars, live pulse dot */
```

**Rule:** Cards are always `10px`. Buttons are always `6px`. Badges and pills are always `0px`. Do not mix these.

---

## Components

### Navigation Bar

```
Height:          52px
Background:      #FFFFFF
Bottom border:   0.5px solid #E8E7E2
Horizontal pad:  24px
```

**Logo area:** `>_` mark in 28×28px navy square (radius 6px) + `ProdHub` text (15px, weight 700, navy) + `FELLOWSHIP` badge (mono, 8px, uppercase, amber border).

**Nav links:** 13px, weight 500, color `#6B7280`. Hover: `background #F3F4F6`, color `#111`. Active: `color #2563EB`, `background #EFF6FF`, radius 6px.

**Right side:** Role label in mono-sm + 30px avatar circle (navy fill, white initials).

**Rule:** One active nav item at a time. Active state is blue text + blue-tinted background — never underline, never bold.

---

### Hero Panel

```
Background:     #0F2D52
Border-radius:  10px
Padding:        32px 36px
Top accent:     2px gradient left-border (blue → amber → transparent)
```

Internal hierarchy:
1. Eyebrow — mono-sm, amber, with 5px amber dot
2. Headline — display size, white, weight 800, -0.02em tracking
3. Subline — 13px, rgba(255,255,255,0.55)
4. Stat row — separated by `rgba(255,255,255,0.10)` top border, mono-lg values in amber, mono-sm labels in rgba(255,255,255,0.40)

---

### Cards

**Section card (home nav cards):**
```
Background:   #FFFFFF
Border:       0.5px solid #E8E7E2
Radius:       10px
Padding:      20px
Hover:        border-color #2563EB + box-shadow 0 0 0 3px rgba(37,99,235,0.08) + translateY(-1px)
```

Internal layout: icon container (36×36px, category-colored background) → title (h3) → description (body) → CTA link (13px, accent blue, with arrow icon).

**Tool card:**
```
Background:   #FFFFFF
Border:       0.5px solid #E8E7E2
Radius:       10px
Padding:      18px 20px
Left accent:  3px solid #E8E7E2 (resting) → 3px solid #2563EB (hover)
Hover:        border-color #BFDBFE + translateX(2px) — slides right into the accent
```

The left accent slide is the primary hover signal. Do not add background changes on hover — the slide is enough.

**Stat card (live count):**
```
Background:   #0F2D52
Radius:       10px
Padding:      20px
```

No border on dark surface cards.

**List box (nested inside cards):**
```
Background:   #F9FAFB
Border:       0.5px solid #F3F4F6
Radius:       8px
Padding:      12px 14px
```

---

### Buttons

```
PRIMARY   — #0F2D52 fill, white text, radius 6px, height 48px (login), 36px (default)
SECONDARY — white fill, 0.5px border #D1D5DB, #374151 text, radius 6px
GHOST     — no fill, no border, #2563EB text — tertiary actions only
DANGER    — #EF4444 fill, white text
DISABLED  — #EDEDEA fill, #9CA3AF text, cursor not-allowed
```

Hover: 8% darken on fill.
Active: `translateY(1px)` — subtle physical press. No scale transforms.

**Rule:** One PRIMARY button per visible viewport. The Google sign-in button is the only primary on the login screen.

---

### Filter Pills

```
Font:         DM Sans, 11px, weight 600, letter-spacing 0.02em
Padding:      5px 12px
Radius:       0px — sharp corners, utility feel
Border:       0.5px solid #D1D5DB
Background:   #FFFFFF
Text:         #6B7280
```

Active state:
```
Background:   #0F2D52
Text:         #FFFFFF
Border-color: #0F2D52
```

Hover (inactive): `border-color #0F2D52`, `color #0F2D52`.

**Rule:** Pills have zero border radius. They are utility controls, not decorative elements.

---

### Category Badges (Tool Cards)

```
Font:         IBM Plex Mono, 9px, weight 500, uppercase, letter-spacing 0.08em
Padding:      3px 8px
Radius:       0px
Display:      inline-flex with 10px tag icon
```

Colors: see Category Badge Colors table above. Never use navy or accent blue for badges — they are reserved for interactive elements.

---

### Search Bar

```
Height:       42px
Background:   #FFFFFF
Border:       0.5px solid #E8E7E2
Radius:       8px
Padding:      0 14px
Icon:         16px search icon, color #9CA3AF
Placeholder:  13px, color #C4C4C0
```

Focus state: `border-color #2563EB`, `box-shadow: 0 0 0 3px rgba(37,99,235,0.10)`.

---

### Icon Containers (Section Cards)

```
Size:     36×36px
Radius:   8px
```

Color by section:
- Tools: `#EFF6FF` background, `#2563EB` icon
- Resources: `#FFFBEB` background, `#D97706` icon
- Resume: `#EFF2FA` background, `#0F2D52` icon

Icon size: 18px (Lucide React, stroke-width 1.5).

---

### Live Count Widget

```
Container:   dark surface card (navy)
Eyebrow:     mono-sm, rgba(255,255,255,0.35)
Live badge:  mono-sm, #10B981, with 5px pulsing dot
Number:      IBM Plex Mono, 36px, weight 500, white
Sub-label:   11px, rgba(255,255,255,0.40)
```

Pulse animation:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(1.5); }
}
```
Duration: 2s, infinite. Apply only to the 5px dot. Never to the number itself.

---

### Formula Chip

```
Font:       IBM Plex Mono, 11px, color #1D4ED8
Background: #EFF6FF
Border:     0.5px solid #BFDBFE
Radius:     4px
Padding:    4px 10px
Display:    inline-block
Margin:     4px 0
```

Used for XYZ formula, code snippets, and structured formats in the Resume Tips section.

---

### Sidebar Keyword Card

```
Background:   #0F2D52
Radius:       10px
Padding:      18px
```

Internal:
- Eyebrow: mono-sm, rgba(255,255,255,0.35)
- Group label: mono-sm, #F59E0B (amber)
- Keywords: 12px, weight 600, white
- Group separator: 0.5px solid rgba(255,255,255,0.10)
- Footnote: 10px italic, rgba(255,255,255,0.35)

---

## Motion

```css
--transition-fast:  150ms ease-out   /* Hover fills, color changes, pill active */
--transition-base:  200ms ease-out   /* Card hovers, border transitions */
--transition-slow:  300ms ease-out   /* Page transitions, drawer open */
```

**Allowed:**
- `translateY(-1px)` on section card hover (200ms)
- `translateX(2px)` on tool card hover (200ms) — the left-accent slide
- `translateY(1px)` on button active press (100ms)
- Border-color transitions on hover (150ms)
- Live pulse dot (CSS animation, 2s)
- Toast slide-in from right (300ms)
- Page fade-in on route change (opacity 0→1, 200ms)

**Not allowed:**
- Scale transforms on cards
- Parallax or scroll-triggered animations
- Bounce or spring easings
- Transitions longer than 300ms

---

## Iconography

Library: **Lucide React** (outline, stroke-width: 1.5 — consistent across all icons)

```
13px  — Badge icons (tag icon in category badges)
15–16px — Inline with body text, form elements
17–18px — Card section titles, nav links
20px  — Standalone decorative (feature icons with colored bg)
```

**Rule:** Icons in nav links and card titles always paired with text. Icon-only only for ✕ close and + add — both require tooltip on hover.

---

## Layout

### Page Structure
```
Nav bar:          52px fixed top, full width
Page background:  #F7F6F2
Content area:     max-width 1200px, centered
Body padding:     24px (vertical and horizontal)
```

### Grid Patterns
- **Home section cards:** `grid-template-columns: repeat(3, 1fr)`, gap 12px
- **Tools grid:** `grid-template-columns: 1fr 1fr`, gap 10px
- **Resume layout:** `grid-template-columns: 1fr 260px`, gap 16px, align-items start
- **Home bottom:** `grid-template-columns: 1fr 280px`, gap 12px

### Breakpoints
```css
--bp-mobile:   480px
--bp-tablet:   768px   /* Stack home bottom grid to 1fr */
--bp-desktop:  1024px  /* Full layout */
```

---

## Accessibility

- Minimum contrast: 4.5:1 body text, 3:1 large text — enforced by neutral scale
- Focus rings: `box-shadow: 0 0 0 3px rgba(37,99,235,0.10)` + `border-color #2563EB` on all interactive elements — never hidden with `outline: none` without a replacement
- Touch targets: minimum 44×44px — nav links, pills, and cards all meet this
- Form labels: always `<label for="...">`, never placeholder-as-label
- Color is never the sole signal — category badges use both color and text label
- All icon-only elements have `aria-label` or `aria-hidden="true"` if decorative

---

## What We Do Not Use

| Avoided | Reason |
|---------|--------|
| Box shadows | We use surface contrast instead. Shadows imply floating — nothing floats in ProdHub |
| Gradients on surfaces | The hero accent bar is the only gradient. It's 2px — earned, not decorative |
| Rounded corners > 10px | Cards are 10px. Nothing is rounder. Excessive rounding looks soft, not professional |
| Cold grey backgrounds | `#F7F6F2` is warm off-white. Cold grey (`#F5F5F5`, `#F3F3F3`) is harsher on the eyes for reading |
| Purple, teal, or pink brand accents | Not in palette. Category badges use these ranges in muted form only |
| Animations > 300ms | Feels slow on a utility product |
| Multiple font families | DM Sans + IBM Plex Mono. Two families maximum |
| Font weights 600 or 700 on body text | 400 for body, 500 for labels, 700/800 for headings. Nothing in between |
| All-caps body text | Only mono-sm eyebrows and badge labels are uppercase |