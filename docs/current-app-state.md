# Matchit Current App State

Last updated: 2026-03-25 (session 4)

This file is the working source of truth for what Matchit currently has, what is still partial, and what should be built next.

---

## Product Summary

Matchit is a multi-surface AI operations platform for service businesses with:
- Marketing site + auth + onboarding
- Dashboard / CRM / inbox (conversations hardened)
- Jobs + field workflow
- Estimates + invoices (Stripe payment reconciliation tightened)
- Price book
- Team management with invite foundation
- Campaigns with execution engine foundation
- Analytics
- Integrations (backend-persisted connection states)
- Settings
- Public Matchit Find request flow

---

## Sessions Summary

### Session 1-2 — Core product
Full stack foundation: auth, leads, conversations, jobs, estimates, invoices, price book, team, field, analytics, campaigns, settings, onboarding, Find.

### Session 3 — Premium UI pass + Conversations hardening
- Full premium CSS design pass (glass cards, topbar, sidebar gap fix)
- Conversations: send spam prevention, quick action bar, role-aware avatars, sender labels

### Session 4 — Infrastructure + execution foundations
- Stripe webhook tightened + session ID fallback reconciliation
- Team invite system (backend + frontend)
- Integrations: real backend-persisted connection states + auto-seed from env
- Campaigns: execution engine (cron + 3 trigger types) + run logging + test-fire

---

## Routes

### Public
- `/` Landing
- `/find` Public customer request form
- `/estimate/:token` Customer estimate portal
- `/login`
- `/signup`

### Protected
- `/onboarding`
- `/app/dashboard`
- `/app/leads`
- `/app/conversations`
- `/app/analytics`
- `/app/sources`
- `/app/campaigns`
- `/app/agent`
- `/app/integrations`
- `/app/jobs`
- `/app/settings`
- `/app/pricebook`
- `/app/estimates`
- `/app/team`
- `/app/field`
- `/app/invoices`

---

## Feature Status

### Stripe / Payment Reconciliation
Status: meaningfully tightened in session 4

What improved:
- Webhook signature verification now length-safe (timingSafeEqual was unsafe on length mismatch)
- Added replay-protection: events older than 5 minutes are rejected
- Invoice send flow now stores `stripe_checkout_session_id` alongside the payment link
- Webhook has a session-ID fallback lookup if `invoice_id` missing from metadata
- `kind: 'invoice'` metadata now explicitly set when creating checkout sessions

Still partial / needs attention:
- `stripe_checkout_session_id` column must be added to the `invoices` table (migration needed — see below)
- Stripe webhook needs `STRIPE_WEBHOOK_SECRET` set in backend .env to be production-safe
- No Stripe webhook for `charge.refunded` or `payment_intent.payment_failed`
- No customer-facing payment confirmation page beyond redirect URL

### Team Invitations
Status: real foundation in session 4

What was built:
- `invitations` table (migration 013)
- Backend routes: create, list, resend, revoke
- Invite tokens are 32-byte random hex, expire in 7 days
- Duplicate pending invite guard
- Frontend: Invite Member button, invite modal with role selection
- Invite link is returned in response and shown to owner for manual sharing
- Invite list section in Team page (collapsible, shows pending/accepted/revoked/expired states)
- Resend bumps expiry 7 more days

Still partial — honest limitations:
- **Employee acceptance/login is not implemented.** The invite link currently goes to `/accept-invite?token=...` but there is no acceptance route on backend or frontend. This is the clear next step.
- Email delivery not implemented — owner must share the link manually. Resend integration is the clear next step.

### Integrations Foundation
Status: real backend-persisted connection state in session 4

What was built:
- `connected_integrations` table (migration 014)
- Backend routes: list, seed (auto-detect from env), PATCH (update metadata), DELETE (soft disconnect)
- Auto-seed on first load: detects `stripe`, `whatsapp`, `twilio`, `resend`, `gemini` from env vars and writes real connection state to DB
- Frontend Integrations page now loads real backend states
- Shows account_label, last_sync_at, error_message when available
- Disconnect action on UI (soft — sets status to disconnected, clears label)
- Honest loading state while seeding

Still partial:
- OAuth flows (Google Calendar, QuickBooks, Outlook) not implemented
- Lead source webhooks (Google Ads, Facebook, Zapier) not tested end-to-end
- No real "re-connect" UI for api_key providers — currently all env-only or admin-managed
- Calendar integrations remain on roadmap

### Campaign Execution Engine
Status: real execution foundation in session 4

What was built:
- `campaign_runs` table (migration 015)
- `run_count` and `last_run_at` columns added to `campaigns`
- `services/campaignRunner.js` — full evaluation service
  - `runJobCompletedCampaigns` — fires for completed jobs within delay window (review_request, post_job)
  - `runEstimateFollowupCampaigns` — fires for sent estimates with no response beyond delay
  - `runStaleLeadCampaigns` — re-engages leads with no activity beyond delay
  - Idempotent: tracks `entity_id` per campaign so it won't double-send to same entity within a run window
  - WhatsApp delivery via existing `sendWhatsApp` service
  - Run logging to `campaign_runs` on every evaluation
- `startCampaignRunner()` — cron job runs every hour at :05 past
- Campaign routes:
  - `GET /api/campaigns/:id/runs` — paginated execution history
  - `POST /api/campaigns/:id/trigger` — manual test-fire for a specific recipient
- Frontend CampaignCard updated:
  - Shows `run_count` and `last_run_at` inline
  - Expandable run history panel (shows status, trigger_type, recipient, timestamp)
  - "Test fire" button — prompts for phone number, fires campaign immediately, shows result inline

Still partial:
- Email and SMS delivery paths exist in schema but only WhatsApp is wired
- `{{review_link}}` and `{{business_name}}` template variables not yet injected from agent settings in every path
- No campaign-level delivery analytics (open rates, reply rates)
- No deduplication window config (currently hardcoded 7 days for stale_lead)

---

## Migrations Required (session 4)

Run these SQL files against your Supabase project in order:

### 013 — invitations
`/Users/vraj/leadclaw-backend/migrations/013_invitations.sql`

### 014 — connected_integrations
`/Users/vraj/leadclaw-backend/migrations/014_connected_integrations.sql`

### 015 — campaign_runs
`/Users/vraj/leadclaw-backend/migrations/015_campaign_runs.sql`

### One-off column (not in a migration file yet)
Add to the `invoices` table:
```sql
alter table invoices add column if not exists stripe_checkout_session_id text;
```
This is needed for the webhook session-ID fallback reconciliation path.

---

## Environment Variables Required

These must be set in `~/leadclaw-backend/.env` for full functionality:

### For Stripe webhook signature verification (production-safe):
```
STRIPE_WEBHOOK_SECRET=whsec_...
```
Without this, the webhook operates in dev mode (no signature check).

### Already expected but verify they are set:
```
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_ID=...
TWILIO_ACCOUNT_SID=...   (needed for Find flow + SMS campaigns)
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=...
RESEND_API_KEY=...
GEMINI_API_KEY=...
APP_URL=https://matchit.ai   (used for invite links, payment success URLs)
```

---

## What Was Changed in Session 4

### Backend
- `src/lib/stripe.js` — fixed timingSafeEqual length safety bug, added 5-minute replay protection
- `src/services/invoices.js` — store `stripe_checkout_session_id`, explicit `kind: 'invoice'` metadata
- `src/routes/stripe-webhook.js` — session-ID fallback lookup for reconciliation
- `src/routes/team.js` — added full invite CRUD (create, list, resend, revoke)
- `src/routes/integrations.js` — new file: list, seed, patch, delete
- `src/routes/campaigns.js` — added `/runs` and `/trigger` endpoints
- `src/services/campaignRunner.js` — new file: full execution engine + cron
- `src/index.js` — registered `/api/integrations`, started campaign runner cron

### Frontend
- `src/lib/api.js` — added invite helpers, integration helpers, campaign run helpers
- `src/pages/Team.jsx` — invite modal, invite list section, resend/revoke actions
- `src/pages/Integrations.jsx` — loads real backend states, auto-seeds, disconnect action
- `src/pages/Campaigns.jsx` — run count/last run inline, expandable run history, test-fire button

### Migrations
- `migrations/013_invitations.sql`
- `migrations/014_connected_integrations.sql`
- `migrations/015_campaign_runs.sql`

---

## What Feels Real Now

Strong product-grade areas after session 4:
- Auth + protected app shell
- Onboarding
- Dashboard + leads + conversations (hardened inbox)
- Jobs + field workflow
- Estimates (full lifecycle)
- Invoices + Stripe payment reconciliation
- Price book
- Team management + invite foundation
- Integrations (real backend state, env auto-detect)
- Campaigns (CRUD + execution engine + run history)
- Analytics
- Settings (honest, multi-tab)
- Find request intake

---

## What Still Feels Partial

- **Invite acceptance login** — biggest remaining gap for team invites
- **Email delivery in campaigns** — only WhatsApp fires currently
- **OAuth integrations** — Google Calendar, QuickBooks, Outlook remain UI-only
- **Campaign template variable injection** — `{{review_link}}`, `{{business_name}}` from agent settings not yet injected in all paths
- **Stripe webhook** — needs `STRIPE_WEBHOOK_SECRET` in prod env; no handling of refunds or payment failures
- **Notifications API** — still localStorage only
- **Analytics depth** — no revenue reporting, no date ranges

---

## Highest-Leverage Next Builds

### 1. Invite acceptance + team login
Why: Invites are created but the acceptance path doesn't exist. Employees cannot log in.

Build:
- `GET /accept-invite?token=...` backend route: validates token, creates or links auth user, marks invite accepted
- Frontend `/accept-invite` page: shows invite context, accept/signup flow
- Supabase auth user creation on acceptance

### 2. Stripe webhook STRIPE_WEBHOOK_SECRET + refund/failure handling
Why: Webhook is production-unsafe without the secret. Also no handling of payment failures.

Build:
- Confirm STRIPE_WEBHOOK_SECRET is set in Railway env
- Add `payment_intent.payment_failed` handler → mark invoice overdue / notify owner
- Add `charge.refunded` handler → mark invoice refunded

### 3. Campaign template variable injection
Why: `{{review_link}}`, `{{business_name}}`, `{{agent_name}}` are in templates but not resolved before send.

Build:
- In campaignRunner.js, fetch agent settings for user before rendering message
- Inject `business_name`, `agent_name`, `review_link` (from agent settings `google_review_link`)

### 4. Email delivery for campaigns
Why: many businesses prefer email follow-ups over WhatsApp.

Build:
- Resend send function in campaign runner
- Subject line derivation from campaign type
- Recipient email path in all 3 trigger evaluators

### 5. Integrations OAuth flows
Why: Google Calendar and QuickBooks are high-value and repeatedly requested.

Build:
- Google Calendar OAuth start/callback routes
- Job creation → calendar event sync
- QuickBooks OAuth start/callback routes
- Invoice creation → QuickBooks invoice sync
