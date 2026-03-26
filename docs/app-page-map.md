# Matchit App Page Map

This document is a practical page-by-page map of the frontend app in
`/src`. It is meant to help engineers quickly understand what each surface
does, what data it depends on, and where to start when changing it.

## App Structure

### Entry points
- [`src/main.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/main.jsx)
  Mounts the React app.
- [`src/App.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/App.jsx)
  Defines public routes, protected routes, and redirect aliases.

### Shared shell
- [`src/components/Layout.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/Layout.jsx)
  Provider-side shell wrapper. Loads top-level stats and renders the sidebar, topbar, and route outlet.
- [`src/components/Sidebar.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/Sidebar.jsx)
  Protected app navigation for operations, growth, and configuration.
- [`src/components/Topbar.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/Topbar.jsx)
  Route-aware page title, subtitle, and top-level action/status area.
- [`src/components/ProtectedRoute.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/ProtectedRoute.jsx)
  Redirects unauthenticated users away from protected pages.

### Shared UI primitives
- [`src/components/ui/Button.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/ui/Button.jsx)
- [`src/components/ui/Card.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/ui/Card.jsx)
- [`src/components/ui/KpiCard.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/ui/KpiCard.jsx)
- [`src/components/ui/ModalShell.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/ui/ModalShell.jsx)
- [`src/components/ui/PageHero.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/ui/PageHero.jsx)
- [`src/components/ui/Tag.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/ui/Tag.jsx)

### Shared business helpers
- [`src/lib/api.js`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/lib/api.js)
  Central API wrapper and endpoint helpers.
- [`src/lib/auth.js`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/lib/auth.js)
  Token and auth request helpers.
- [`src/context/AuthContext.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/context/AuthContext.jsx)
  Auth state and login/signup/logout actions.
- [`src/lib/lineItems.js`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/lib/lineItems.js)
  Shared line-item math/helpers for estimates and invoices.
- [`src/components/LineItemsEditor.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/LineItemsEditor.jsx)
  Reusable line-item editing UI.

## Public / Customer-Side Pages

### Landing
- Route: `/`
- File: [`src/pages/Landing.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Landing.jsx)
- Purpose:
  Marketing homepage and high-level product story.
- Main concerns:
  Brand narrative, workflow explanation, primary CTAs.
- Depends on:
  Navigation and static content only.

### Find
- Route: `/find`
- File: [`src/pages/Find.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Find.jsx)
- Purpose:
  Customer-side request intake flow for Matchit Find.
- Main concerns:
  Collect customer need, urgency, and service category before sending a request.
- Depends on:
  `submitFindRequest` in [`src/lib/api.js`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/lib/api.js)

### Public Estimate
- Route: `/estimate/:token`
- File: [`src/pages/PublicEstimate.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/PublicEstimate.jsx)
- Purpose:
  Customer-facing estimate review, approval, decline, and deposit path.
- Depends on:
  Public estimate helpers in [`src/lib/api.js`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/lib/api.js)

### Login
- Route: `/login`
- File: [`src/pages/Login.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Login.jsx)
- Purpose:
  Existing-user authentication entry point.

### Signup
- Route: `/signup`
- File: [`src/pages/Signup.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Signup.jsx)
- Purpose:
  New business account creation flow.

### Accept Invite
- Route: `/accept-invite`
- File: [`src/pages/AcceptInvite.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/AcceptInvite.jsx)
- Purpose:
  Public invite acceptance flow for staff joining a workspace.
- Depends on:
  `getInvitePreview` and `acceptInvite`

## Protected / Provider-Side Pages

### Onboarding
- Route: `/onboarding`
- File: [`src/pages/Onboarding.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Onboarding.jsx)
- Purpose:
  First-run business setup and AI/business context collection.

### Dashboard
- Route: `/app/dashboard`
- File: [`src/pages/Dashboard.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Dashboard.jsx)
- Purpose:
  Provider command center for AI activity, lead flow, and KPIs.
- Depends on:
  `fetchStats`, `fetchLeads`

### Leads
- Route: `/app/leads`
- File: [`src/pages/Leads.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Leads.jsx)
- Purpose:
  Lead queue, search, filtering, and next-action review.
- Depends on:
  `fetchLeads`

### Conversations
- Route: `/app/conversations`
- File: [`src/pages/Conversations.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Conversations.jsx)
- Purpose:
  Inbox for customer conversations and manual follow-up.
- Depends on:
  `fetchConversations`, `fetchMessages`, `sendMessage`

### Analytics
- Route: `/app/analytics`
- File: [`src/pages/Analytics.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Analytics.jsx)
- Purpose:
  Funnel, campaign, lead, estimate, and job metrics.
- Depends on:
  `fetchAnalytics`

### Sources
- Route: `/app/sources`
- File: [`src/pages/Sources.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Sources.jsx)
- Purpose:
  Lead source catalog and setup guidance.

### Campaigns
- Route: `/app/campaigns`
- File: [`src/pages/Campaigns.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Campaigns.jsx)
- Purpose:
  Campaign CRUD, campaign run history, and manual trigger/testing.
- Depends on:
  Campaign helpers in [`src/lib/api.js`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/lib/api.js)

### Agent Setup
- Route: `/app/agent`
- File: [`src/pages/AgentSetup.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/AgentSetup.jsx)
- Purpose:
  Configure the provider AI agent’s behavior, services, and messaging.

### Integrations
- Route: `/app/integrations`
- File: [`src/pages/Integrations.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Integrations.jsx)
- Purpose:
  Show real backend-driven integration state and setup posture.
- Depends on:
  `fetchIntegrations`, `seedIntegrations`, `disconnectIntegration`

### Jobs
- Route: `/app/jobs`
- File: [`src/pages/Jobs.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Jobs.jsx)
- Purpose:
  Job scheduling, assignment, and operational status tracking.

### Settings
- Route: `/app/settings`
- File: [`src/pages/Settings.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Settings.jsx)
- Purpose:
  Workspace profile, notifications, billing/account framing, and channel settings.

### Price Book
- Route: `/app/pricebook`
- File: [`src/pages/PriceBook.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/PriceBook.jsx)
- Purpose:
  Manage services, pricing, categories, and quote/invoice inputs.

### Estimates
- Route: `/app/estimates`
- File: [`src/pages/Estimates.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Estimates.jsx)
- Purpose:
  Build, send, track, and convert estimates.
- Depends on:
  Estimate helpers and shared line-item UI.

### Team
- Route: `/app/team`
- File: [`src/pages/Team.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Team.jsx)
- Purpose:
  Manage staff members and invitations.

### Field
- Route: `/app/field`
- File: [`src/pages/Field.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Field.jsx)
- Purpose:
  Technician-facing workflow for job progress and completion.

### Invoices
- Route: `/app/invoices`
- File: [`src/pages/Invoices.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/pages/Invoices.jsx)
- Purpose:
  Create, send, and track invoices and payment status.

## Cross-Cutting Concerns

### Styling
- Primary stylesheet:
  [`src/index.css`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/index.css)
- Current role:
  Houses the full design system, shell styles, page styles, and shared utility classes.
- Maintenance note:
  Prefer updating shared tokens and reusable sections before adding page-specific one-off selectors.

### API Surface
- All frontend API calls currently go through:
  [`src/lib/api.js`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/lib/api.js)
- Maintenance note:
  New endpoints should usually be added here first, then consumed in page components.

### Auth
- Auth provider:
  [`src/context/AuthContext.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/context/AuthContext.jsx)
- Auth helper:
  [`src/lib/auth.js`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/lib/auth.js)
- Route protection:
  [`src/components/ProtectedRoute.jsx`](/Users/vraj/.gemini/antigravity/scratch/leadclaw-app/src/components/ProtectedRoute.jsx)

## Suggested Maintenance Rules

- Keep business logic in page helpers or shared modules, not scattered inline in JSX.
- Keep network calls in `src/lib/api.js`.
- Add comments only where they explain intent or non-obvious behavior.
- Prefer shared UI primitives over repeating inline styles.
- Keep `docs/current-app-state.md` updated when workflows become real or change meaningfully.
