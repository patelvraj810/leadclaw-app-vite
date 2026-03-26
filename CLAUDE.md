# MATCHIT — Project Context

## What Is Matchit
Two-sided AI platform for service businesses.
Domain: matchit.ai
Side 1 — Matchit for Business: service businesses subscribe ($49-499/mo), AI handles leads, booking, WhatsApp, invoicing, team management, reminders, follow-ups
Side 2 — Matchit Find: customers post urgent requests, AI matches them to available businesses
One brand, two dashboards. Think Airbnb host/traveller model.
Target market: HVAC, plumbing, electrical, cleaning, landscaping in GTA Canada

## Codebase Locations
Frontend: /Users/vraj/.gemini/antigravity/scratch/leadclaw-app/
Backend: ~/leadclaw-backend/

## Tech Stack
Frontend: React 19 + Vite 8 + React Router v7 (no Tailwind — custom CSS vars)
Backend: Node.js + Express 5 (CommonJS)
Database: Supabase (Postgres) with Row Level Security
AI: Gemini Flash-Lite (`@google/generative-ai`)
Email: Resend
WhatsApp: Meta Cloud API (main) + Twilio (Find endpoint)
Payments: Stripe
Booking: Cal.com
Scheduling: node-cron
Deploy: Vercel (frontend) + Railway (backend)

## What Is Built

### Frontend — src/pages/
- `Landing.jsx` — Marketing landing page, two-column hero with live AI panel — NEEDS TESTING
- `Login.jsx` — Login form (email + password) — NEEDS TESTING
- `Signup.jsx` — Two-step signup (name/email/password → businessName/industry) → navigates to /onboarding — NEEDS TESTING
- `Onboarding.jsx` — **Full 7-step RAG-based onboarding wizard**: business basics, services, agent personality, knowledge training, operating hours, lead sources, plan selection. On final step POSTs to /api/onboarding/complete — NEEDS TESTING
- `Dashboard.jsx` — KPI stats from /api/stats + setup checklist + recent leads — NEEDS TESTING
- `Leads.jsx` — Lead list from /api/leads — NEEDS TESTING
- `Conversations.jsx` — Conversation inbox + message thread — NEEDS TESTING
- `Analytics.jsx` — Analytics view (scaffolded) — NEEDS TESTING
- `AgentSetup.jsx` — AI agent configuration (name, tone, services, knowledge base) — NEEDS TESTING
- `Integrations.jsx` — Integrations management (UI only, no live endpoints) — NEEDS TESTING
- `Sources.jsx` — Lead source management — NEEDS TESTING
- `Campaigns.jsx` — Campaign management — NEEDS TESTING
- `Find.jsx` — Public Matchit Find form (no auth) — NEEDS TESTING
- `Jobs.jsx` — Jobs/appointments list from /api/jobs — NEEDS TESTING
- `Settings.jsx` — Tabbed settings: Profile, Channels, Notifications, Billing — NEEDS TESTING
- `PriceBook.jsx` — Price book items from /api/pricebook — NEEDS TESTING

### Frontend — src/components/
- `Layout.jsx` — App shell wrapping sidebar + outlet (protected routes) — WORKING
- `ProtectedRoute.jsx` — JWT auth guard, redirects to /login if no token — WORKING
- `Sidebar.jsx` — Navigation sidebar with badge counts, pipeline metric, user pill — WORKING
- `Topbar.jsx` — Top nav with route-driven title, single AI status indicator — WORKING
- `ui/Button.jsx` — Reusable button component — WORKING
- `ui/Card.jsx` — Reusable card container — WORKING
- `ui/KpiCard.jsx` — Dashboard KPI metric card — WORKING
- `ui/Tag.jsx` — Status tag/badge component — WORKING

### Frontend — src/context/ and src/lib/
- `context/AuthContext.jsx` — JWT auth state, login/logout/signup, verifies token on startup via /auth/me — WORKING
- `lib/api.js` — API client with Bearer token injection, all API helpers — WORKING
- `lib/auth.js` — Login/signup/logout, token + user storage in localStorage (matchit_token, matchit_user) — WORKING

### Backend — src/routes/
- `routes/auth.js` — POST /auth/signup, POST /auth/login, GET /auth/me, POST /auth/logout
- `routes/agentSettings.js` — GET/POST /api/agent-settings (agents table + users name/phone update)
- `routes/onboarding.js` — GET /api/onboarding/status, POST /api/onboarding/complete, GET/POST /api/onboarding/knowledge
- `routes/pricebook.js` — CRUD /api/pricebook
- `routes/jobs.js` — CRUD /api/jobs
- `routes/channels.js` — GET/POST /api/channels
- `routes/analytics.js` — GET /api/analytics
- `routes/invoices.js` — CRUD /api/invoices + POST /api/invoices/:id/send
- `routes/webhook.js` — POST /webhook/inbound
- `routes/whatsapp.js` — GET/POST /webhook/whatsapp

### Backend — src/services/
- `services/pipeline.js` — Lead processing, RAG context injection (knowledge base + pricebook + hours), AI response
- `services/reminders.js` — Appointment reminder cron jobs (24h, 2h, 30min before job via WhatsApp)
- `services/morningBriefing.js` — Daily 7am WhatsApp briefing to owner
- `services/endOfDaySummary.js` — Daily 6pm WhatsApp summary to owner
- `services/invoices.js` — Invoice generation + Stripe payment link creation

### Backend — src/lib/ and src/middleware/
- `lib/db.js` — Supabase client (service key, bypasses RLS)
- `lib/ai.js` — Gemini Flash-Lite chat wrapper
- `lib/auth.js` — JWT generation + bcryptjs password hashing
- `lib/systemPrompt.js` — Builds AI system prompt with RAG injection (knowledge docs, pricebook, operating hours)
- `lib/whatsapp.js` — Meta Cloud API message sender
- `lib/email.js` — Resend client
- `lib/stripe.js` — Stripe payment link creation
- `middleware/authenticate.js` — JWT verify middleware

## API Endpoints

### Auth
- `POST /auth/signup` — Creates Supabase auth user + users row + agents row, returns JWT
- `POST /auth/login` — Returns JWT + user profile
- `GET /auth/me` — Returns current user profile (protected)
- `POST /auth/logout` — Client-side only

### Onboarding
- `GET /api/onboarding/status` — `{ completed: boolean }`
- `POST /api/onboarding/complete` — Saves all onboarding data: updates users + agents + inserts business_documents
- `GET /api/onboarding/knowledge` — List business documents for user
- `POST /api/onboarding/knowledge` — Upsert a document by doc_type

### Agent Settings
- `GET /api/agent-settings` — Returns agents row for current user
- `POST /api/agent-settings` — Upserts agents row; also updates users.name and users.phone if provided as owner_name/owner_phone

### Core Data (inline in src/index.js)
- `GET /api/leads` — All leads ordered by created_at desc (protected)
- `GET /api/conversations` — All conversations with leads join + last message (protected)
- `GET /api/stats` — leadsToday, qualified, thisMonth, totalConversations (protected)
- `GET /api/messages/:conversationId` — Messages for a conversation (protected)
- `POST /api/find/request` — Public: `{category, urgency, description, whatsapp}` → service_requests table + Twilio WhatsApp

### Jobs, Price Book, Channels
- `GET/POST /api/jobs` — Jobs list + create (protected)
- `PATCH /api/jobs/:id` — Update job (protected)
- `GET/POST /api/pricebook` — Price book items (protected)
- `PATCH /api/pricebook/:id`, `DELETE /api/pricebook/:id`
- `GET/POST /api/channels` — Channel config (protected)

## Database Tables (cumulative — all migrations run)

### users (001 + 003)
`id`, `email`, `name`, `phone`, `owner_whatsapp`, `business_name`, `industry`, `subscription_tier` (default: starter), `onboarding_completed` (004), `created_at`

### agents (001 + 003 + 004)
`id`, `user_id`, `name`, `business_name`, `services` (TEXT[]), `service_area`, `tone`, `opening_message`, `channels` (JSONB), `owner_phone`, `google_review_link`, `emergency_available`, `operating_hours` (JSONB), `selected_sources` (TEXT[]), `created_at`

### leads (001)
`id`, `user_id`, `contact_name`, `contact_email`, `contact_phone`, `source`, `source_detail`, `message`, `qualification_status` (default: pending), `last_contact_at`, `created_at`
⚠️ Use `contact_name` — some older code incorrectly used `customer_name`

### conversations (001)
`id`, `user_id`, `lead_id`, `agent_id`, `channel`, `status`, `created_at`

### messages (001)
`id`, `user_id`, `conversation_id`, `lead_id`, `direction`, `sender_type`, `sender_name`, `content`, `channel`, `status`, `created_at`

### jobs (003)
`id`, `user_id`, `lead_id`, `customer_name`, `customer_phone`, `customer_email`, `job_description`, `service_type`, `address`, `scheduled_date`, `scheduled_time`, `duration_hours`, `status` (scheduled/confirmed/in_progress/completed/cancelled), `price`, `notes`, `technician_name`, `completed_at`, `created_at`, `updated_at`

### pricebook_items (003)
`id`, `user_id`, `name`, `description`, `category`, `unit_price`, `unit`, `is_active`, `created_at`

### invoices
`id`, `user_id`, `lead_id`, `job_description`, `line_items` (JSONB), `subtotal`, `tax_rate`, `tax_amount`, `total`, `status` (draft/sent/unpaid/paid/overdue/cancelled), `stripe_payment_link`, `stripe_payment_intent_id`, `sent_at`, `paid_at`, `due_date`, `created_at`, `updated_at`

### business_documents (004)
`id`, `user_id`, `doc_name`, `doc_type` (pricing/faq/about/general), `raw_content`, `created_at`

### service_requests (002)
`id`, `category`, `urgency`, `description`, `contact_phone`, `status` (default: new), `created_at`

### reminders
`id`, `booking_id` (⚠️ references bookings table — NOT YET CREATED), `customer_phone`, `customer_name`, `owner_phone`, `type`, `message`, `scheduled_for`, `status`, `sent_at`, `created_at`

## Environment Variables

### Backend (`~/leadclaw-backend/.env`)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
WHATSAPP_VERIFY_TOKEN=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
```

⚠️ These are in code but not yet confirmed in .env:
```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
OWNER_WHATSAPP=
CAL_API_KEY=
```

### Frontend (`.env.local`)
```
VITE_API_URL=http://localhost:3000
```

## Known Issues / Gaps
1. **`bookings` table doesn't exist** — `reminders` table FK references it; reminders cron will fail
2. **TWILIO keys may be missing from .env** — `/api/find/request` and owner WhatsApp notifications
3. **`contact_name` vs `customer_name`** — DB column is `contact_name`; verify invoices route uses correct name
4. **Health check still says "leadclaw-backend"** — `GET /` should return `matchit-backend`
5. **Stripe webhook not implemented** — invoices never auto-flip to "paid"
6. **AI history format** — pipeline sends `{role, parts: [{text}]}` but ai.js may read `h.content` — verify

## What Needs To Be Built Next (highest leverage first)
1. **Estimates / proposals** — biggest competitor gap vs Jobber/HouseCall Pro
2. **Online booking + customer portal** — self-serve for customers
3. **Invoicing + payments + Stripe webhook** — close the revenue loop
4. **Recurring jobs + dispatch routing**
5. **Review and reputation automation** — auto-send Google review link after job complete
6. **AI lead recovery / quote follow-up sequences** — Day 2, 5, 10
7. **Matchit Find marketplace routing** — connect Find requests to matched businesses
8. **Owner copilot** — WhatsApp commands to check stats, reschedule, message customers
9. **Memberships / service agreements**
10. **AI phone calls (Vapi.ai)** — top-tier plan only ($199/mo)

## Design System
```css
--bg: #fafaf8          /* warm off-white page background */
--surface: #fff
--surface2: #f4f4f0
--surface3: #eeeee8
--text: #111110
--text2: #6b6b66
--text3: #a8a8a0
--green: #16a34a       /* primary action, live/healthy status */
--blue: #2563eb        /* system intelligence */
--amber: #d97706       /* urgency */
--red: #dc2626
--r: 10px
--rl: 16px
--rxl: 24px
```
Fonts: Satoshi (body), Clash Display (h1-h4 + logo), JetBrains Mono (mono/badge)

Design rules:
- Never show fake or mock data — empty state instead
- Mobile first — sidebar slides in on mobile
- Green is the primary action colour
- Layered atmospheric surfaces (glass + soft shadows) over flat gray borders
- One high-contrast focal panel per screen
- Status indicators use subtle pulse/glow, not loud animation

## Branding Rules
- Product name: Matchit (capital M)
- Domain: matchit.ai
- **Never say LeadClaw anywhere in UI**
- Tagline: "Your service business, fully automated."
- Footer: "© 2026 Matchit · matchit.ai"

## How To Run Locally
```
# Terminal 1 — Backend
cd ~/leadclaw-backend && node src/index.js   # http://localhost:3000

# Terminal 2 — Frontend
cd /Users/vraj/.gemini/antigravity/scratch/leadclaw-app && npm run dev   # http://localhost:5173
```

## Owner
Vraj Patel — Brampton, Ontario, Canada
Building Matchit as a side project. Goal: 10 paying customers in 60 days then raise pre-seed.

## Instructions For Any AI Reading This File
- Read this file first before making any changes
- Check actual source files before assuming anything is built or working
- Never add mock or fake data to any page
- Never change the design system colours or fonts
- Always replace LeadClaw with Matchit if found in UI
- When in doubt about what is built, read the actual source files
- MATCHIT_CONTEXT.md was a duplicate of this file and has been deleted
