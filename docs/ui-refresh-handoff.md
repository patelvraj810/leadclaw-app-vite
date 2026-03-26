# UI Refresh Handoff

## Goal
Modernize `Matchit` so it feels like a live AI sales command center rather than an older flat SaaS dashboard.

## Design Direction
- Keep the existing brand voice and product structure.
- Shift from flat white cards to layered atmospheric surfaces.
- Emphasize "live AI operations" through glow, contrast, status indicators, and stronger hero/dashboard hierarchy.
- Preserve the current light theme, but make it feel premium and more current.

## Core Visual Changes
- Backgrounds now use soft radial gradients and depth instead of a plain flat canvas.
- Shared surfaces use translucent white with blur, softer shadows, and larger radii.
- Primary action buttons now use a dark teal gradient instead of flat black.
- Accent usage is centered around:
  - green for live/active/healthy
  - blue for system intelligence
  - amber for urgency
  - reduced reliance on purple
- Typography contrast is stronger:
  - larger page titles
  - more editorial hero headings
  - KPI values are larger and more dominant

## Files Changed
- `src/index.css`
- `src/pages/Landing.jsx`
- `src/components/Topbar.jsx`
- `src/components/Sidebar.jsx`
- `src/pages/Dashboard.jsx`

## What Changed Per File

### `src/index.css`
- Added a new "modern refresh" layer at the end of the file so it overrides older styles without requiring a full rewrite.
- Updated root tokens for color, shadows, and glass-like surfaces.
- Refreshed shared primitives:
  - `body`
  - `.btn`
  - `.btn-dark`
  - `.btn-ghost`
  - `.tag`
  - input/select/textarea styles
- Restyled app shell:
  - `.sidebar`
  - `.sb-*`
  - `.topbar`
  - `.tb-*`
  - `.page`
- Added new landing hero styles:
  - `.hero-grid`
  - `.hero-copy`
  - `.hero-panel`
  - `.hero-signal-*`
  - `.hero-feed-*`
  - `.hero-orb-*`
- Added dashboard hero styles:
  - `.dash-hero`
  - `.dash-hero-*`
- Updated KPI presentation:
  - `.kpi`
  - `.kpi-label`
  - `.kpi-value`
  - compatibility for older `.kpi-lbl` and `.kpi-val`
- Added responsive rules for the new hero and dashboard sections.

### `src/pages/Landing.jsx`
- Replaced the old centered hero with a two-column layout:
  - left side = product pitch and CTAs
  - right side = live AI activity panel
- Added a more visual "live system" panel with:
  - online status pill
  - high-signal metrics
  - short activity feed
- Updated hero copy to feel more premium and operational.

### `src/components/Topbar.jsx`
- Added a persistent AI live-status pill on desktop.
- Grouped header layout into:
  - `topbar-main`
  - `topbar-actions`
- Kept route-driven actions intact.

### `src/components/Sidebar.jsx`
- Upgraded the brand area with:
  - logo mark container
  - subtitle: `AI sales command`
  - `LIVE` status badge
- Added a sidebar metric block near the bottom for at-a-glance pipeline context.
- Preserved existing nav structure and routes.

### `src/pages/Dashboard.jsx`
- Added a new hero section above KPI cards.
- The dashboard hero introduces:
  - a stronger page narrative
  - two main actions
  - three high-contrast stats in a right-side rail
- Marked the activity card with `activity-card` so it can receive more distinctive styling.

## Implementation Notes
- The refresh was intentionally done as an additive override layer to reduce merge risk with the ongoing work in the repo.
- Existing component structure was mostly preserved.
- Most of the visual shift comes from CSS token changes plus a few new semantic wrapper classes.

## Important Context For Follow-Up Work
- The app still has pre-existing lint/runtime issues unrelated to this design refresh.
- This refresh does not attempt to fully redesign all screens yet.
- The biggest untouched pages from a design consistency perspective are:
  - conversations
  - leads
  - analytics
  - find page
  - onboarding/auth flows

## Suggested Next Steps
- Extend the same visual language into `Leads` and `Conversations`.
- Replace remaining inline styles with reusable utility classes or semantic classes.
- Create a small shared design token section for:
  - glass surfaces
  - panel tiers
  - live status treatments
  - shadow presets
- Fix older structural issues while continuing the refresh:
  - `Layout.jsx` fetch shadowing bug
  - leads table column mismatch
  - auth/backend contract mismatches

## Design Rules To Keep Consistency
- Prefer atmospheric depth over flat gray borders.
- Use one high-contrast focal panel per screen.
- Keep status indicators alive with subtle pulse/glow, not loud animation.
- Favor bold typography and clean spacing over adding more decorative elements.
- Use dark premium panels sparingly for emphasis, not everywhere.
