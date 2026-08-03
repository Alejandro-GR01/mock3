---
name: Mock3 — Industrial Workspace
theme: dark-first
colors:
  dark:
    bg-activity: '#181818'
    bg-sidebar: '#1F1F1F'
    bg-editor: '#252526'
    bg-terminal: '#1E1E1E'
    border: '#2B2B2B'
    border-strong: '#3E3E3E'
    accent-blue: '#007ACC'
    accent-amber: '#CCA700'
    accent-amber-light: '#D7BA7D'
    text-primary: '#E0E0E0'
    text-secondary: '#A0A0A0'
    text-muted: '#6B6B6B'
  light:
    bg-activity: '#F3F3F3'
    bg-sidebar: '#F3F3F3'
    bg-editor: '#FFFFFF'
    bg-terminal: '#F8F8F8'
    border: '#E4E4E4'
    accent-blue: '#0062A3'
    accent-amber: '#997D00'
    text-primary: '#1F1F1F'
    text-secondary: '#5A5A5A'
    text-muted: '#8A8A8A'
http-methods:
  get: '#10B981'
  post: '#60A5FA'
  put: '#F59E0B'
  patch: '#FB923C'
  delete: '#EF4444'
state:
  success: '#10B981'
  warning: '#F59E0B'
  error: '#EF4444'
  info: '#60A5FA'
typography:
  font-sans: Inter
  font-sans-alt: Geist Sans
  font-mono: JetBrains Mono
  ui-title:
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  ui-nav:
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  code-method:
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.03em
  code-route:
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
  code-base:
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  status:
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.06em
  headline-md:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-lg:
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
spacing:
  activity-bar-width: 48px
  sidebar-width: 260px
  gutter: 1px
  padding-xs: 4px
  padding-sm: 8px
  padding-md: 12px
  control-height: 32px
  container-gap: 0px
---

# Mock3 Design System — Industrial Workspace

## Brand & Style

Mock3 is an **Industrial Workspace** — a fusion of **Postman** (the API-workflow mental model) and **VS Code** (the low-saturation, high-density editor aesthetic). This is the **Option 1: Cobalt Blue & Amber** direction, and it is the *only* direction.

The interface is engineered for information density and functional precision: flat surfaces, rigid 1px technical borders, and **tonal layering instead of shadows**. The UI must *disappear* so the user's mock endpoints and JSON payloads remain the primary focus. The emotional register is reliability, technical mastery, and low-latency — a tool that feels like an instrument, not a marketing site.

**Mode: Operate.** Every decision below optimizes scanability, consistency, and the real usage scene (developers configuring mocks for hours under dim light). Expression lives in precise details — the cobalt accent, the mono data, the amber premium signal — never in decoration.

## Design Rationale (why this world)

1. **Cobalt Blue is the structural accent, not the brand logo.** `#007ACC` (`accent-blue`) is the de-facto standard for developer tooling. It signals interactivity and focus instantly — zero learning curve — without competing with the functional HTTP method colors. Neon accents were rejected: they fatigue in high-density tools and clash with the emerald/blue/red of HTTP methods.
2. **Low-saturation neutrals reduce eye fatigue.** The four dark surfaces (`bg-activity #181818 → bg-sidebar #1F1F1F → bg-editor #252526 → bg-terminal #1E1E1E`) are separated by tiny tonal steps, not contrast jumps. Long engineering sessions need quiet backgrounds.
3. **The premium GOLD is a semantic lock, not a palette color.** The premium signal is the specific gold ramp — `accent-amber #CCA700` and its highlight `#D7BA7D` — and it appears in exactly one semantic place: *premium*. When a developer sees gold, they read "money / Pro plan". This converts the paywall into a visual language and gives it conversion value. (See the amber-family resolution below.)
4. **Monospace is for DATA, sans is for UI.** Routes, methods, JSON, timestamps, and key prefixes are data — they read in JetBrains Mono. Labels, nav, and titles are prose — they read in Inter.

---

## Color System — Cobalt Blue & Amber

**Dark Mode is the production primary** (developers, dim rooms, prolonged sessions). Light Mode is the documented alternative for marketing/docs/admin flows and is contrast-corrected per value.

> **Token naming:** All tokens below use the **real Tailwind v4 `@theme` names** as implemented in `mock3-dashboard/src/index.css` — `bg-activity`, `accent-blue`, `http-get`, `state-success`, etc. There is no `workspace-*`, `method-*`, `cobalt`, or `amber` namespace. Usage in components: `bg-bg-editor`, `border-border`, `text-accent-blue`, `text-http-get`, `bg-http-get/10`.

### Dark Mode (production primary)

| Token | Value | Semantic meaning | When to use |
|-------|-------|------------------|-------------|
| `bg-activity` | `#181818` | Outer chrome / global context rail. Matte carbon black. The darkest surface; the app's anchor. | Activity Bar rail, status bar, window frame, any "app shell" chrome |
| `bg-sidebar` | `#1F1F1F` | Explorer / navigation panels. Slate gray, one tonal step up from the activity bar. | Sidebar navigation, tree views, resource lists, panel headers, table header rows |
| `bg-editor` | `#252526` | Central work surface. The brightest neutral in the IDE body; where content lives. | Main stage / body. ⚠️ NOT for cards — cards use `--card` `#2D2D2D` (one step above) + `border-strong` |
| `bg-terminal` | `#1E1E1E` | Console / code input "well". Deliberately darker than the editor so code reads as an inset material. | JSON editor, response body viewer, request console, command/status input wells |
| `border` | `#2B2B2B` | 1px technical divider. The primary line color in the system. | Panel gutters, table row dividers, control outlines, tab seams |
| `border-strong` | `#3E3E3E` | Stronger divider. The hover/emphasis step of `border`. | Hover states, scrollbar thumb hover, emphasized separators |
| `accent-blue` | `#007ACC` | THE accent — cobalt. Active, focused, interactive. | Primary buttons, active tabs, focus states, selected list items, active links, interactive icon accents |
| `accent-amber` | `#CCA700` | **PREMIUM GOLD ONLY.** The Pro Plan signal. | Pro badges, upgrade/paywall CTAs, premium feature borders, "Unlock Pro" empty states |
| `accent-amber-light` | `#D7BA7D` | Premium gold highlight variant for text/icons on dark surfaces (full `#CCA700` can read muddy at small sizes). **Registered as `--color-accent-amber-light` in `@theme` (✅ implemented).** | Premium labels, premium icon strokes, premium feature lists |
| `text-primary` | `#E0E0E0` | Default foreground. | Body text, titles, high-emphasis content |
| `text-secondary` | `#A0A0A0` | Secondary foreground. | Navigation labels, placeholder text, less-emphasis content |
| `text-muted` | `#6B6B6B` | Tertiary / de-emphasized foreground. | Helper text, timestamps, disabled metadata, empty-state copy |

### Light Mode (alternative — documented target, not yet tokenized)

Light mode is **not implemented** in `@theme` (the project is dark-first). The values below are the product brief's contrast-corrected reference for a future light theme; they would be registered as the same token names via a theme override.

| Token | Value | Semantic meaning | When to use |
|-------|-------|------------------|-------------|
| `bg-activity` | `#F3F3F3` | App / sidebar background. Soft silver. | Activity bar, sidebar, panel chrome |
| `bg-sidebar` | `#F3F3F3` | Same silver as activity bar. | Sidebar navigation, panel headers |
| `bg-editor` | `#FFFFFF` | Central work surface, pure white. | Main stage, cards, panels |
| `bg-terminal` | `#F8F8F8` | Console / code input. | JSON editor, response viewer |
| `border` | `#E4E4E4` | Soft textured gray divider. | All 1px lines in light mode |
| `accent-blue` | `#0062A3` | Contrast-corrected accent for light backgrounds (hover step of dark cobalt). | Same roles as dark accent-blue |
| `accent-amber` | `#997D00` | High-contrast premium gold for light backgrounds. | Premium text/icons on white |
| `text-primary` | `#1F1F1F` | Default foreground on light. | Body text, titles |
| `text-secondary` | `#5A5A5A` | Secondary foreground on light. | Nav labels, placeholders |
| `text-muted` | `#8A8A8A` | De-emphasized foreground on light. | Helper text, timestamps |

### State colors (functional status — real tokens)

| Token | Value | Semantic meaning | When to use |
|-------|-------|------------------|-------------|
| `state-success` | `#10B981` | Healthy / complete. | Live indicators, saved states, success toasts, green KPI deltas |
| `state-warning` | `#F59E0B` | Attention / near-expiry. | Key-expiration warnings, warning badges. ⚠️ Shares its value with `http-put` — see resolution below |
| `state-error` | `#EF4444` | Failure / destructive. | Error text, invalid fields, delete hover, error toasts, red KPI deltas |
| `state-info` | `#60A5FA` | Informational. | Info icons, informational accents |

### ⚠️ The Amber-Family Resolution (HARD CONSTRAINT, refined)

**The premium GOLD (`accent-amber #CCA700` and highlight `#D7BA7D`) is reserved for Pro Plan / premium features. It is NEVER used for:**
- Generic warnings or alerts
- Pending/loading states (use accent-blue or neutral)
- Any non-premium UI accent

When a developer sees the gold `#CCA700`, it must mean ONE thing: *premium*. This gives the v0.0.0 paywall (visual-only) semantic weight without any backend enforcement.

**The amber FAMILY is not globally banned.** The value `#F59E0B` (Tailwind `amber-500`) is used by TWO functional tokens — `http-put` and `state-warning` — and it is **visually and semantically distinct** from the premium gold `#CCA700`:

| Token | Value | Hue character | Role |
|-------|-------|---------------|------|
| `accent-amber` | `#CCA700` | Dark, desaturated **gold** (golden-yellow) | Premium only — badges, paywall CTAs |
| `accent-amber-light` | `#D7BA7D` | Light, pale **gold** | Premium text/icons on dark |
| `http-put` | `#F59E0B` | Bright, saturated **amber-orange** | Functional — HTTP PUT method chips |
| `state-warning` | `#F59E0B` | Bright, saturated **amber-orange** | Functional — expiry/warning signals |

The gold and the amber-orange read differently at a glance: `#CCA700` is a darker, greener gold; `#F59E0B` is a brighter, redder orange-amber. They also never share a context — gold appears on premium surfaces (plan cards, paywall), `#F59E0B` appears on method chips and expiry warnings. This coexistence is accepted for v0.0.0 (Decision Log #3/#4).

### HTTP Method Colors — REAL tokens, UNCHANGED

| Method | Token | Value | Notes |
|--------|-------|-------|-------|
| GET | `http-get` | `#10B981` (emerald) | Convention: safe read |
| POST | `http-post` | `#60A5FA` (blue) | Deliberately a LIGHTER blue than cobalt `#007ACC` so method chips never read as interactive buttons |
| PUT | `http-put` | `#F59E0B` (amber-500) | **Kept as-is.** Amber-family but NOT premium gold `#CCA700` — see resolution above. Do NOT re-map |
| PATCH | `http-patch` | `#FB923C` (orange) | Orange step between PUT and DELETE |
| DELETE | `http-delete` | `#EF4444` (red) | Convention: destructive |

**Chip convention (as implemented in `mock3-dashboard/src/lib/http-colors.ts`):** method chips use **colored text + a 10% opacity tint of the same color** — e.g. GET = `text-http-get` + `bg-http-get/10`. They are **never** solid backgrounds with near-black text. The 10% tint keeps chips scannable while letting the colored mono text carry contrast. Unrecognized methods fall back to `text-text-secondary` + `bg-text-secondary/10`.

```ts
export const httpMethodColors = {
  GET:    { text: "text-http-get",    bg: "bg-http-get/10" },
  POST:   { text: "text-http-post",   bg: "bg-http-post/10" },
  PUT:    { text: "text-http-put",    bg: "bg-http-put/10" },
  PATCH:  { text: "text-http-patch",  bg: "bg-http-patch/10" },
  DELETE: { text: "text-http-delete", bg: "bg-http-delete/10" },
};
```

> **Correction:** an earlier draft of this document claimed PUT was "re-mapped to burnt orange `#E8631E`". That was an invention. The real implementation keeps PUT = `#F59E0B`. This document reflects the code.

### Deprecated scheme (DO NOT USE)

The previous Material-ish tokens (`#9fcaff` primary, `surface-container*` ramp, amber-gold as generic warning) are **deprecated**. The old "amber-as-warning" semantic is dissolved: pending → accent-blue, soft warnings → `state-warning` (`#F59E0B`), hard errors → `state-error`. New components must only use the tokens above.

---

## Typography — dual system

### Families

- **UI (Sans):** **Inter** — this is what the project **actually implements** (`--font-sans: "Inter", system-ui, -apple-system, sans-serif`). **Geist Sans** remains an acceptable optional alternative family per the product brief, but it is NOT the current implementation — do not swap unless a future brief explicitly re-decides the family. Native stack: `Inter, system-ui, -apple-system, sans-serif`.
- **Data (Mono):** **JetBrains Mono** — **mandatory for all code/JSON/API paths — no exceptions** (`--font-mono: "JetBrains Mono", ui-monospace, monospace`). Secondary candidates (Geist Mono, Fira Code) are documented only as fallback ideas, not implemented.

### Weight discipline (3-weight rule — HARD CONSTRAINT)

Only three weights exist: **400** (body/data), **500** (navigation/labels), **600** (titles). **700 is reserved exclusively for HTTP methods and API routes.** No 800/900 anywhere. This is what keeps the VS Code aesthetic clean — typographic noise is the enemy.

### Type scale

| Element | Face | Size | Weight | Tailwind equivalent |
|---------|------|------|--------|---------------------|
| Section/panel titles | Inter | 13px | 600 | `font-sans font-semibold` |
| Navigation/labels | Inter | 12px | 500 | `font-sans font-medium` |
| API routes | JetBrains Mono | 11px | 700 | `font-mono font-bold` |
| HTTP method chips | JetBrains Mono | 12px | 700 | `font-mono font-bold tracking-wide` |
| JSON editor / mock content | JetBrains Mono | 12px | 400 | `font-mono` |
| Footer status text | JetBrains Mono | 11px | 400 | `font-mono` |

### Case & spacing rules

- **All-Caps section headers** in the sidebar and activity bar (`label-caps`: 10px, 600, `0.06em` tracking) to denote architectural hierarchy. The sidebar group labels use a wider `0.15em` tracking for the architectural tree. Note: caps uses weight 600, NOT 700 — 700 is reserved for HTTP methods.
- UI text defaults to **12–13px** to preserve information density.
- Tight line-heights (`16–18px`) to maximize visible data.
- Mono is used for: API paths, HTTP methods, JSON bodies, key prefixes, timestamps, status codes, IDs.

---

## Layout & Spacing

**3-Column Vertical IDE Layout.** Rigid, non-fluid primary chrome for predictable hit targets and power-user muscle memory.

1. **Activity Bar (fixed 48px):** far-left narrow rail for global context switching (theme, navigation, account). `bg-activity` surface, `label-caps` labels.
2. **Sidebar (fixed 260px):** resource lists, tree views, mock explorer, API key management. `bg-sidebar` surface.
3. **Main Stage (fluid):** the editor/dashboard view. `bg-editor` surface.

Spacing is governed by the **4px grid**:
- Internal padding: `8px` (controls, list rows)
- Group margins: `12px` (between panels/sections)
- Fine grain: `4px` (`padding-xs`)
- Gutters between major panels: strictly `1px` in `border` color — seamless paneled appearance
- Control height: `32px` standard (incl. buttons, inputs)

---

## Elevation & Depth

Elevation is expressed **exclusively through tonal layering**. **There are no shadows in this design system. Period.** (The only exception is the ephemeral shadcn toast, which may use a shadow to float above the app frame — the IDE chrome itself never does.)

| Level | Surface | What lives here |
|-------|---------|-----------------|
| Level 0 (deepest) | `bg-activity` `#181818` | Activity bar, status bar |
| Level 1 | `bg-sidebar` `#1F1F1F` | Sidebar, panel headers, table header rows |
| Level 2 | `bg-editor` `#252526` | Editor surface, main content (body) |
| Level 2.5 | `--card` `#2D2D2D` + `border-strong` `#3E3E3E` | **Cards/panels — one tonal step ABOVE the body** (⚠️ NOT bg-editor — see card-surface note below) |
| Level 3 (highest) | `bg-editor` tone elevated by 1px `border` + `border-strong` emphasis | Modals, dropdowns, command palette — distinguished by a `1px solid border` and a tonal overlay, never by a shadow |

> **⚠️ Card surface (a11y fix 2026-07-31):** cards must be `--card: #2D2D2D` with `border-border-strong` (`#3E3E3E`), NEVER `bg-editor`/`border-border`. Setting card == body color makes cards invisible (measured ~1.0:1 contrast — reported as a bug). The `#2D2D2D` + `#3E3E3E` frame yields a visible 1.43:1 ratio. Mirrors VS Code: editor `#1E1E1E` → widget `#252526`. Applies to KPICard, ChartCard, MockCard, ApiKeyCard, EmptyState, RateLimitBar, modal panels.

**Active states** use a **2px left-hand accent bar in `accent-blue`** rather than a background brightness change (implemented as `border-l-2 border-accent-blue` on active nav items). Hover uses a subtle white tint (`bg-white/4`); the component-specific hover surfaces (`hover:bg-bg-editor`, `hover:bg-accent-blue/5`) follow the same tonal principle.

**Ambient industrial grid:** the editor background carries a faint 24px dot grid (`radial-gradient(rgba(255,255,255,0.03) 1px)`), an optional ambient texture that reads as blueprint paper without adding noise.

---

## Shapes

**Strictly Square. 0px radius. Everywhere.**
- Buttons, inputs, containers, badges, dialogs, tabs: all 0px (`--radius: 0rem` in `index.css`).
- Even status "pills" render as rectangles.
- Scrollbars are square-cornered (8px, `border` track, `border-strong` on hover).
- Rationale: sharp corners reinforce the industrial, technical nature of an API tool and let components sit perfectly flush, maximizing screen real estate.

---

## Components

### Buttons
- **Primary:** solid `accent-blue`, white label, 0px radius, `32px` height, `8px/12px` padding. Hover: `bg-accent-blue/90`. Focus: `focus-ring` utility (`ring-2 ring-accent-blue/50 ring-offset-1 ring-offset-bg-editor`). Labels: Inter, 12px, 500.
- **Ghost/Secondary:** transparent background, 1px `border`, `text-secondary` label. Hover: `bg-bg-editor` tint + border brightens one step. Used for toolbar secondary actions.
- **Premium (Pro CTA):** solid `accent-amber` `#CCA700` with near-black label — used ONLY for upgrade/paywall actions. Never use accent-blue on an upgrade CTA (it would bury the premium signal).
- Danger actions: `state-error` red only in confirm/delete contexts; the button body stays neutral until the destructive moment.

### Inputs
- 1px `border`, background `bg-terminal` (darker than the editor → "inset" well without shadows), `32px` height, 0px radius.
- Focus: 1px `accent-blue` border + `focus-ring` halo. Placeholder: `text-secondary`. Error: `border-state-error`. Disabled: `text-muted` + reduced border opacity.

### HTTP Chips
- Small rectangles (0px radius), `JetBrains Mono` 11–12px, 700, uppercase.
- **Colored text + `bg-{method}/10` tint** — never solid backgrounds (see `httpMethodColors` above).
- Method colors: GET emerald / POST blue / PUT amber-orange / PATCH orange / DELETE red.

### Lists / Tree Views
- Row height `28px`, hover: subtle white tint.
- Active item: `border-l-2 border-accent-blue` (2px cobalt left accent bar) — NOT a background brightness change.
- All-Caps group headers in `label-caps` style.

### Tabs
- Square, flat, `32px` height. Active tab: **2px cobalt accent bar** + `bg-editor` background. Inactive: `bg-sidebar` background, hover tint.
- Method-to-tab seam: tab bars sit on `border` gutters.

### Data Tables
- **No vertical lines**; only horizontal `1px` dividers in `border`.
- Header row: `bg-sidebar` background (darker than body) to read as pinned.
- Body rows: `bg-editor` background, hover `hover:bg-accent-blue/5`. Paths/IDs/keys in mono (`code-base`); labels in sans.

### Status Bar (bottom chrome)
- `bg-activity` background, `JetBrains Mono` 11px 400 (`status` token).
- Left: connection/DB state (green `state-success` dot when healthy). Right: plan indicator — Pro = gold `accent-amber`, Free = `text-secondary`.

### Badges / Status Pills
- Rectangle, `bg-{state}/10` tint + `text-{state}` (e.g. `bg-state-success/10 text-state-success`), mono 11px.
- A live dot uses `state-success` with a ping ring (`bg-state-success` + animate-ping).

---

## Implementation — Tailwind v4 (REAL)

Mock3 uses **Tailwind CSS v4**, which defines tokens via **`@theme` in CSS — NOT `tailwind.config.js`**. This is the **verbatim `@theme` block** from `mock3-dashboard/src/index.css` — the canonical implementation reference:

```css
/* mock3-dashboard/src/index.css — REAL @theme block */
@theme {
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --color-bg-activity: #181818;      /* activity bar / outer chrome */
  --color-bg-sidebar: #1f1f1f;       /* sidebar / explorer */
  --color-bg-editor: #252526;        /* central work surface */
  --color-bg-terminal: #1e1e1e;      /* console / code input */
  --color-border: #2b2b2b;           /* 1px technical divider */
  --color-border-strong: #3e3e3e;    /* stronger divider (hover/emphasis) */
  --color-accent-blue: #007acc;      /* THE accent — cobalt */
  --color-accent-amber: #cca700;     /* PREMIUM ONLY — Pro Plan */
  --color-text-primary: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-text-muted: #6b6b6b;
  --color-http-get: #10b981;         /* emerald */
  --color-http-post: #60a5fa;        /* blue */
  --color-http-put: #f59e0b;         /* amber-500 */
  --color-http-patch: #fb923c;       /* orange */
  --color-http-delete: #ef4444;      /* red */
  --color-state-success: #10b981;
  --color-state-warning: #f59e0b;
  --color-state-error: #ef4444;
  --color-state-info: #60a5fa;
}
```

Tailwind generates utility classes from these directly: `bg-bg-editor`, `border-border`, `text-text-primary`, `text-accent-blue`, `text-http-get`, `bg-http-get/10`, `bg-state-success/10`, etc.

**Global implementation details (same file):**
- `--radius: 0rem` — the 0px radius rule is enforced at the CSS-variable level (shadcn components derive their radii from it).
- `*:focus-visible { outline: 2px solid var(--color-accent-blue) }` — global focus indicator.
- `::selection { background: var(--color-accent-blue); color: #ffffff }`.
- `focus-ring` utility: `ring-2 ring-accent-blue/50 ring-offset-1 ring-offset-bg-editor`.
- `body` uses `bg-bg-editor` + `text-text-primary` + the 24px ambient dot grid.
- Dark is the default theme (production). The `@theme` defines only dark values; a light theme would override the same `--color-*` variables (see Light Mode table above).

> **⚠️ shadcn sidebar coexistence:** the shadcn/ui sidebar ships its own HSL token set (`--sidebar`, `--sidebar-accent`, `--sidebar-foreground`, `--sidebar-border`) defined in `index.css`. **These were aligned byte-identical to the custom tokens (✅ 2026-07-30):** `--sidebar: #1f1f1f` (≈ `bg-bg-sidebar`), `--sidebar-accent: #252526`, `--sidebar-border: #2b2b2b`, `--sidebar-ring: #007acc`, and `--background/--card/--popover: #252526` (≈ `bg-bg-editor`). Components may freely mix `bg-sidebar` (shadcn) and `bg-bg-sidebar` (custom) — they now resolve to the same surface family.

---

## Decision Log

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Cobalt `accent-blue #007ACC` as the single structural accent | VS Code's de-facto standard; zero learning curve; doesn't compete with HTTP method colors |
| 2 | The premium GOLD (`accent-amber #CCA700` + `#D7BA7D`) is premium-exclusive | Gives gold semantic value (money = gold); reinforces v0.0.0 conversion via visual-only paywall |
| 3 | **PUT stays `#F59E0B` (amber-500)** — NOT re-mapped | An earlier draft invented a re-map to `#E8631E` that was never in code. The real `@theme` keeps `http-put: #f59e0b`. The amber-500 orange is visually distinct from the premium gold `#CCA700` (darker, greener gold) and never shares a context with it (chips/expiry warnings vs plan surfaces). Re-mapping would be churn with no v0.0.0 gain. **If a future brief demands a strict amber-family ban, the change is localized:** update `--color-http-put` in `index.css` (and any hard-coded `amber-*` Tailwind classes) to a clearly non-amber hue; `http-colors.ts` needs no change since it references the token by name |
| 4 | `state-warning` shares `#F59E0B` with `http-put` — accepted | Both are functional, non-premium uses of the amber-orange; neither reads as the premium gold. Keeps the token set small. If product later needs to disambiguate expiry warnings from PUT, add a dedicated `state-warning` value |
| 5 | JetBrains Mono mandatory for data | Routes/methods/JSON are data, not prose; mono gives alignment + code mental model |
| 6 | **Inter is the implemented sans family**; Geist Sans is optional, not primary | The real `@theme` declares `--font-sans: "Inter", ...`. The product brief names Geist Sans; it remains an acceptable alternative but requires an explicit family re-decision to swap |
| 7 | 3-weight typography (400/500/600, 700 only for methods) | Typographic noise is what makes dense tools exhausting; VS Code stays clean BECAUSE it limits weights |
| 8 | 0px radius + 1px borders + tonal layering, no shadows | Industrial, flush components; maximizes density; shadows belong to consumer UIs |
| 9 | Terminal darker than editor | Code wells read as inset "pits" — echoes the classic black console without a shadow |
| 10 | Method chips = colored text + `bg-{method}/10` tint, never solid | As implemented in `http-colors.ts`. Solid chips with near-black text were proposed in an earlier draft but are NOT the real convention; the tint keeps chips scannable while preserving the method's color identity |

---

## References

| File | Role |
|------|------|
| `DESIGN.mock3.md` | **This file** — source of truth for design tokens |
| `.specs/design-system/design-system.md` | Production decision spec (⚠️ still uses the old `workspace-*` token vocabulary — **must be aligned to the real `@theme` names from this document**) |
| `mock3-dashboard/src/index.css` | Tailwind v4 `@theme` token definitions (**real implementation** — the verbatim block above) |
| `mock3-dashboard/src/lib/http-colors.ts` | HTTP method color constants (real chip convention) |
| `AGENTS.md` | Conventions section (consistent: documents `text-http-put` as amber) |
