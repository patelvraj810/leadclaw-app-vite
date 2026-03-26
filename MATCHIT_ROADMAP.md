# MATCHIT — Full Product Roadmap
**Last updated:** March 2026
**Author:** Vraj Patel
**Goal:** 10 paying customers in 60 days → pre-seed raise

---

## GitHub Repos
- Frontend: https://github.com/patelvraj810/leadclaw-app-vite
- Backend: https://github.com/patelvraj810/matchit-backend

---

## Real Problems We're Solving (User Pain Research)

Service business owners (HVAC, plumbing, electrical, cleaning, landscaping) suffer from:

1. **Missed leads on the job** — Owner is under a sink or up a ladder. Customer calls, gets voicemail, calls competitor.
2. **Quote graveyard** — Sends 20 quotes per month, only 4 close. No follow-up system. Leaves $40k+ on the table annually.
3. **Customer ghosting** — Quote sent. Silence. They hired someone cheaper and didn't say anything.
4. **Chasing payments** — Job done 30 days ago, invoice still unpaid. Awkward to keep calling.
5. **Zero-review problem** — Does great work but only angry customers leave reviews. Google profile looks bad.
6. **Admin black hole** — 2-3 hours/day on scheduling, confirming appointments, sending invoices. That's 10-15 hrs/week of unpaid work.
7. **No idea what's working** — Spending on Google Ads + Kijiji + door knocking. No clue which source actually converts.
8. **Seasonality overwhelm** — Spring HVAC surge hits, 40 leads in a week, can't manage all of them manually.
9. **Emergency customer nightmare** — "My furnace is out at 2am." Owner's phone rings at midnight. Can't ignore it. Can't handle it either.
10. **One bad review can kill the business** — A vindictive customer leaves 1-star. Owner has no system to proactively collect good reviews.

**Matchit's answer to all 10:** One AI agent that never sleeps, never misses a lead, follows up relentlessly, collects reviews automatically, and sends invoices while the owner is still on the job.

---

## Competitive Gap Analysis

### What competitors have that Matchit NEEDS

| Feature | Jobber ($49-249/mo) | HouseCall Pro ($59-299/mo) | ServiceTitan ($400+/mo) | **Matchit** |
|---------|--------------------|--------------------------|-----------------------|-------------|
| Job scheduling | ✓ | ✓ | ✓ | ✓ partial |
| Quotes/Estimates | ✓ | ✓ | ✓ | ✗ MISSING |
| Invoice + payment | ✓ | ✓ | ✓ | ✓ built |
| Review requests | ✓ | ✓ | ✓ | ✗ MISSING |
| Online booking | ✓ | ✓ | ✓ | ✗ MISSING |
| Recurring service plans | ✗ | ✓ | ✓ | ✗ MISSING |
| Client portal | ✓ | ✓ | ✓ | ✗ MISSING |
| GPS tracking | ✗ | ✓ | ✓ | ✗ MISSING |
| Team features | ✓ | ✓ | ✓ | ✗ MISSING |
| Mobile app | ✓ | ✓ | ✓ | ✗ MISSING |
| AI WhatsApp agent | ✗ | ✗ | ✗ | ✓ UNIQUE |
| AI phone answering | ✗ | ✗ | ✗ | 🔜 Phase 5 |
| Lead marketplace (Find) | ✗ | ✗ | ✗ | ✓ UNIQUE |
| AI Instagram/FB DMs | ✗ | ✗ | ✗ | 🔜 Phase 4 |
| Canadian-first (HomeStars, Kijiji) | ✗ | ✗ | ✗ | 🔜 Phase 4 |

**Matchit's core differentiation:** Jobber organizes your existing customers. Matchit finds you NEW ones AND organizes them.

---

## Current Status Audit

### Backend — What's Actually Working vs Broken

**WORKING:**
- Auth (signup/login/JWT) ✓
- Leads CRUD ✓
- Conversations + messages ✓
- WhatsApp inbound/outbound (Meta Cloud API) ✓
- AI pipeline (Gemini Flash-Lite) — mostly working
- Jobs CRUD ✓
- PriceBook CRUD ✓
- Invoices + Stripe payment links ✓
- Analytics endpoint ✓
- Agent settings save/load ✓
- Morning briefing cron (7am) ✓
- End of day summary cron (6pm) ✓
- Invoice reminder cron (10am) ✓
- Find marketplace + matching engine ✓
- Channels config ✓

**CRITICAL BUGS to fix in Phase 1:**
1. **AI history format mismatch** — `pipeline.js` sends `{role, parts: [{text}]}` but `ai.js` reads `h.content` → TypeError breaks AI conversations
2. **`contact_name` vs `customer_name`** — leads table uses `contact_name`, invoices route queries `customer_name`, findMatching inserts `name` → data corruption
3. **No Stripe webhook** — invoices never get marked `paid` because no endpoint listens to `payment.success`
4. **Missing env var validation** — server starts without TWILIO keys, fails silently at runtime
5. **`bookings` table missing** — reminders table has FK to non-existent bookings table

**MISSING from backend (to build in phases 2-6):**
- Quotes/Estimates endpoints
- Review request trigger (when job marked complete)
- Cal.com booking integration
- RAG: inject pricebook items into AI system prompt
- Owner back-channel command parsing (inbound WhatsApp from owner)
- Lead scoring auto-update in pipeline
- Multi-tenant WhatsApp routing (by destination phone number)
- Stripe webhook handler
- RLS policies on all Supabase tables
- Phone/Voice call endpoints (Phase 5)
- Recurring service plans
- Team/multi-user support

### Frontend — What's Actually Working vs Stub

**WORKING (real UI + API calls):**
- Login ✓
- Signup ✓
- Dashboard (real stats) ✓
- Leads (real data, filter by status) ✓
- Conversations (chat UI, real messages) ✓
- AgentSetup (save/load from backend) ✓
- Jobs (full CRUD, tabs, mark complete) ✓
- PriceBook (CRUD, grouped by category) ✓
- Find (public request form, real submission) ✓

**PARTIAL (needs work):**
- Onboarding — saves to localStorage only, not API
- Analytics — falls back to /api/stats, no dedicated analytics chart data
- Settings — Notifications tab localStorage only, Billing tab no upgrade flow

**STUB (placeholder only):**
- Integrations — alert() stubs, hardcoded `connected: false`
- Sources — purely informational, no configuration
- Campaigns — empty state + "coming soon" alerts

---

## PHASE PLAN

---

## Phase 1: Fix What's Broken (Priority: CRITICAL)
**Timeline: 2-3 days**
**Goal: Everything that's built actually works end-to-end**

### 1.1 Fix AI history format bug
- `src/lib/ai.js`: Change `h.content` → `h.parts[0].text` in history mapping
- Test: Send message, see if AI maintains conversation context

### 1.2 Fix contact_name consistency
- Audit all places: `pipeline.js`, `findMatching.js`, `invoices.js`, `invoices.js` service
- Standardize to `contact_name` everywhere (matches migration 001)
- Update queries and inserts

### 1.3 Create Stripe webhook endpoint
- `POST /webhook/stripe` — verify signature, handle `checkout.session.completed`
- Call `markInvoicePaid(invoiceId, paymentIntentId)`
- Add `STRIPE_WEBHOOK_SECRET` to .env

### 1.4 Fix bookings FK in reminders table
- Option A: Create `bookings` table (UUID, user_id, lead_id, scheduled_at)
- Option B: Remove FK constraint from reminders (simpler, do this first)
- New migration: `004_fix_reminders_fk.sql`

### 1.5 Fix Onboarding to save to API
- After completing onboarding steps, POST to `/auth/me` (update user) + `/api/agent-settings`
- Stop saving to localStorage

### 1.6 Add startup env var validation
- On server start, warn loudly if TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, WHATSAPP_TOKEN, OWNER_PHONE are missing

### 1.7 Add Supabase RLS Policies
- Migration `005_rls_policies.sql`
- Enable RLS on: users, leads, conversations, messages, jobs, pricebook_items, invoices, agents
- Policy template: `CREATE POLICY ... USING (user_id = auth.uid())`

---

## Phase 2: Fix Scaffolding (Priority: HIGH)
**Timeline: 3-5 days**
**Goal: All existing pages have real functionality**

### 2.1 Analytics Page — Build real analytics backend + charts
- Backend: `/api/analytics/full` — return:
  - Revenue by month (from invoices.total where status=paid)
  - Leads by source (group by source)
  - Conversion rate (qualified / total)
  - Avg time to close (diff between created_at and qualified_at)
  - Top services requested
- Frontend: Real bar charts (pure CSS as per design system), revenue trend line

### 2.2 Settings Page — Connect Notifications to API
- Backend: Add `notification_prefs` JSONB column to users table
- Frontend: Settings > Notifications tab POSTs to `/api/settings/notifications`
- Also wire Billing tab to show current subscription from Stripe customer object

### 2.3 Integrations Page — Make it real
- Show WhatsApp status (is WHATSAPP_TOKEN set + test connection)
- Show Stripe status (is STRIPE_SECRET_KEY set)
- Show Cal.com status (is CAL_API_KEY set)
- Connect buttons → show config modal (not just alert)
- For MVP: Show connected/not-connected status, link to setup guide

### 2.4 Sources Page — Show real source stats
- Add source breakdown from analytics (leads count per source)
- Show "Active" only if leads have come from that source in last 30 days

### 2.5 Campaigns Page — Build basic WhatsApp blast
- Backend: `POST /api/campaigns/blast` — send WhatsApp to all leads with status=X
- Frontend: Campaign creator modal — pick target status, write message, preview, send
- Show campaign history (who was messaged, when, count)

### 2.6 Wire AI to PriceBook (RAG)
- Backend: In `systemPrompt.js`, add function to load user's pricebook items
- Inject as part of system prompt: "Your pricing:\n{items}"
- Test: Customer asks "how much for a drain cleaning?" → AI quotes from pricebook

---

## Phase 3: Competitor Parity (Priority: HIGH)
**Timeline: 1-2 weeks**
**Goal: Match everything Jobber and HouseCall Pro have**

### 3.1 Quotes / Estimates Feature
The biggest gap. All 3 competitors have this.

**Backend:**
- New table: `quotes` (id, user_id, lead_id, job_description, line_items JSONB, subtotal, tax_rate, tax_amount, total, status: draft/sent/viewed/accepted/declined/expired, stripe_payment_link, sent_at, viewed_at, accepted_at, expires_at, created_at)
- Migration: `006_quotes.sql`
- Routes: `src/routes/quotes.js`
  - `GET /api/quotes` — list quotes
  - `POST /api/quotes` — create quote (can pull from pricebook)
  - `GET /api/quotes/:id` — single quote
  - `PATCH /api/quotes/:id` — update
  - `DELETE /api/quotes/:id` — delete
  - `POST /api/quotes/:id/send` — send via WhatsApp + email, generate shareable link
  - `POST /api/quotes/:id/accept` — customer accepts (webhook from customer portal link)
- Quote → Job conversion: When accepted, auto-create job from quote data

**Frontend:**
- New page: `src/pages/Quotes.jsx`
  - List view with status tabs (draft/sent/accepted/declined)
  - Create modal — pulls from pricebook items, add line items, custom discount
  - Send modal — choose WhatsApp or email
  - Accept/Decline tracking
- Add to sidebar + App.jsx routes

**Quote follow-up automation:**
- Day 2: "Hey [name], just checking in on that quote I sent for [service]..."
- Day 5: "Still interested? Happy to adjust the scope if budget is a concern."
- Day 10: "Last follow-up — quote expires soon. Let me know either way!"

### 3.2 Review Request Automation
Second biggest gap. All competitors have this.

**Backend:**
- In `routes/jobs.js` POST `/:id/complete`:
  - After marking job complete, queue a review request message
  - Send immediately or 2 hours after completion (configurable)
  - Message: "Hey [name], thanks for choosing [business]! Glad we could help with [service]. If you have a minute, a Google review helps us a lot: [Google review link]. Takes 30 seconds!"
- Agent settings: Add `google_review_link` field + `auto_review_request: boolean`
- Store: `review_requests` table (id, user_id, lead_id, job_id, sent_at, clicked_at)

**Frontend:**
- Settings > Agent tab: Add "Google Review Link" field + toggle for auto-request
- Jobs page: Show "Review sent" badge on completed jobs

### 3.3 Online Booking (Cal.com Integration)
Third biggest gap.

**Backend:**
- `POST /api/booking/create` — create a Cal.com booking using CAL_API_KEY
  - Takes: lead_id, event_type_id, start_time, name, email, phone, notes
  - Creates booking in Cal.com
  - Creates job record in Matchit
  - Sends WhatsApp confirmation to customer
- `POST /webhook/calcom` — receive Cal.com webhooks for booking.confirmed, booking.cancelled, booking.rescheduled
  - Update job status accordingly
  - Send WhatsApp to customer on changes

**Frontend:**
- Jobs page: "Schedule" button opens booking modal
- Customer gets booking link via WhatsApp (AI sends when lead qualifies)
- AgentSetup: Add Cal.com event type URL field

### 3.4 Recurring Service Plans
**Backend:**
- New table: `service_plans` (id, user_id, lead_id, service_name, frequency: monthly/quarterly/biannual/annual, price, next_service_date, status: active/paused/cancelled, created_at)
- `GET/POST /api/service-plans` endpoints
- Cron job: Daily check for plans with next_service_date = today → auto-create job + notify lead via WhatsApp

**Frontend:**
- New tab in Jobs page: "Recurring Plans"
- Create plan modal (assign to lead, set service + frequency)

---

## Phase 4: Advanced Features (Priority: MEDIUM)
**Timeline: 2-3 weeks**
**Goal: Build things competitors CAN'T do**

### 4.1 Client Portal
- Public link: `matchit.ai/portal/{token}`
- Customer can view: their jobs history, invoices, pay outstanding invoices, accept/decline quotes
- Backend: Generate signed portal tokens per lead, store in leads table
- Frontend: New public page `src/pages/Portal.jsx`
- AI sends portal link after first interaction: "You can view your jobs and invoices here: [link]"

### 4.2 Canadian-First Integrations
- **HomeStars**: Scrape/monitor their lead notifications, auto-respond to new HomeStars leads
- **Kijiji**: Monitor service postings in user's area, AI responds as business owner
- **Require manual setup first**: User provides their HomeStars email credentials or Kijiji posting ID

### 4.3 AI Instagram & Facebook DMs
- Backend: Meta webhook for Instagram messages + Facebook Messenger
- Route them through same AI pipeline as WhatsApp
- Track source as `instagram` or `facebook`
- Frontend: Sources page shows Instagram/Facebook as active when connected

### 4.4 AI Owner Back-Channel (WhatsApp Commands)
Owner texts their own AI agent:
- "Show me today's leads" → AI replies with list
- "Send invoice to John $350 for drain cleaning" → AI creates + sends invoice
- "Reschedule John to Thursday 2pm" → AI updates job, notifies customer
- "Who hasn't paid?" → AI lists overdue invoices
- Backend: Parse owner's WhatsApp messages in `routes/whatsapp.js` by checking if sender == owner_phone
- Route to command parser instead of lead pipeline

### 4.5 Lead Scoring & Auto-Qualification
- In `pipeline.js`, after AI generates response, ask Gemini to score the lead 1-10 + suggest status
- Prompt: "Based on this conversation, score this lead 1-10 for conversion probability and suggest status: new/warm/hot/qualified/lost. Return JSON."
- Update lead.qualification_status automatically
- Dashboard shows leads ranked by score

### 4.6 RAG: Business Document Upload
- Backend: `POST /api/documents/upload` — accept PDF/TXT
  - Parse with Gemini (extract key info)
  - Store extracted text in `business_documents` table
  - Include in system prompt context
- Use cases: price list PDF, service area boundaries, warranty terms
- Frontend: AgentSetup page > "Upload business documents" section

### 4.7 Better Analytics — Full Revenue Dashboard
- Monthly recurring revenue (MRR from service plans)
- Revenue by service type
- Lead-to-paid conversion rate
- Average job value
- Best performing lead source (by revenue, not just count)
- Seasonal trends (month over month)

---

## Phase 5: AI Phone Call Feature (Priority: MEDIUM — Top Tier Only)
**Timeline: 3-4 weeks**
**Tier: $199/mo plan only**

### Research Summary
Best options ranked for Matchit:
1. **Vapi.ai** — Best for startups. Easy API, inbound + outbound, ~$0.07-0.15/min, low latency (~150-300ms)
2. **Retell AI** — Slightly lower latency (~100-250ms), better turn-taking, similar pricing
3. **Twilio Voice + OpenAI** — More control, higher complexity, better for enterprise later

**Architecture:**
```
Inbound: Customer calls business's Matchit number
→ Vapi.ai answers
→ STT (Deepgram) → Gemini Flash (LLM) → ElevenLabs TTS
→ AI collects: name, service needed, urgency, address
→ Creates lead in Matchit DB
→ Optional: transfer to owner (whisper mode)

Outbound: Cron triggers follow-up call
→ POST /api/voice/call-lead {leadId}
→ Vapi.ai places call
→ AI: "Hi, I'm Aria calling from [Business]. Are you still looking for [service]?"
→ Call transcript saved to conversation
```

**Prompt for current pricing research (send to Perplexity/GPT with web access):**
> "Search for current March 2026 pricing for AI voice agent platforms: Vapi.ai, Retell AI, Bland.ai. For each: per-minute cost for inbound and outbound calls, free tier or minimum monthly, whether they support both directions, and latency specs if published. Format as comparison table."

### 5.1 Backend: Voice Foundation
- New env vars: `VAPI_API_KEY`, `VAPI_PHONE_NUMBER_ID`
- New route: `src/routes/voice.js`
  - `POST /webhook/vapi` — receive Vapi call events (call.started, call.ended, transcript)
  - `POST /api/voice/call/:leadId` — trigger outbound call
  - `GET /api/voice/calls` — list call history
- New table: `calls` (id, user_id, lead_id, vapi_call_id, direction, duration, transcript, recording_url, created_at)
- System prompt for voice: Different from WhatsApp — shorter sentences, natural pauses, "Got it" confirmations

### 5.2 Backend: Phone Number Provisioning
- When user signs up for top tier, provision a Vapi phone number via API
- Store in agents table: `vapi_phone_number`, `vapi_assistant_id`
- User's customers call that number → Vapi answers as AI

### 5.3 Frontend: Voice Settings
- AgentSetup > Voice tab:
  - Enable/disable phone answering
  - AI voice selection (choose from ElevenLabs voices)
  - Handoff settings (transfer to owner after X seconds or on demand)
  - Call hours (don't answer calls from midnight to 6am)
- Dashboard: "Calls today" KPI card
- Conversations: Show call transcripts alongside WhatsApp messages

### 5.4 Outbound Call Triggers
- After job marked complete: Outbound call 2 hours later for feedback + review
- After quote sent: Outbound call Day 3 if no response
- After cold lead (no response 7 days): Outbound re-engagement call
- All configurable in campaign settings

---

## Phase 6: Growth & Scale (Priority: LOW — After 10 customers)
**Timeline: Ongoing**

### 6.1 Mobile App (React Native)
- Core screens: Dashboard, Jobs today, New lead notification, Quick invoice
- Push notifications for new leads
- GPS check-in for field techs

### 6.2 Team Features
- Invite team members (technicians, admin)
- Job assignment to specific tech
- Tech mobile view: see their jobs for today
- Team morning briefing (separate WhatsApp group message)
- Job completion by tech → notification to owner

### 6.3 Stripe Subscription Management
- Self-serve upgrade/downgrade
- Trial → paid conversion flow
- Proration on plan changes
- Dunning (retry failed payments, send dunning emails)

### 6.4 Matchit Find v2 (Two-Sided Marketplace)
- Customer-facing `find.matchit.ai` landing page
- Business profile pages (public SEO pages)
- Lead auction (businesses bid per-lead in competitive categories)
- Review aggregation on business profiles
- Trust badges (verified, response rate, avg rating)

### 6.5 Enterprise / ServiceTitan Killer
- Multi-location support
- Custom AI training on business data
- Dedicated account manager
- Custom integrations (QuickBooks, ERP)
- SLA guarantees

---

## Environment Variables Needed Right Now

Add these to `~/leadclaw-backend/.env` before testing:
```
# Already have:
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
WHATSAPP_VERIFY_TOKEN=
JWT_SECRET=

# MISSING — add these:
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
OWNER_WHATSAPP=        # Your WhatsApp number for briefings
OWNER_PHONE=           # Same number, just the digits
STRIPE_WEBHOOK_SECRET= # From Stripe dashboard > Webhooks
PORT=3000
FRONTEND_URL=https://matchit.ai

# Phase 5 (later):
VAPI_API_KEY=
VAPI_PHONE_NUMBER_ID=
CAL_API_KEY=           # Already have? Wire it up in Phase 3
```

---

## Migration Files Status

| File | Status |
|------|--------|
| `001_create_schema.sql` | ✓ Run |
| `002_service_requests.sql` | ✓ Run |
| `003_jobs_and_more.sql` | ✓ Run |
| `004_fix_reminders_fk.sql` | 🔜 Phase 1 |
| `005_rls_policies.sql` | 🔜 Phase 1 |
| `006_quotes.sql` | 🔜 Phase 3 |
| `007_review_requests.sql` | 🔜 Phase 3 |
| `008_service_plans.sql` | 🔜 Phase 3 |
| `009_calls.sql` | 🔜 Phase 5 |
| `010_client_portal.sql` | 🔜 Phase 4 |

---

## 60-Day Sprint to 10 Customers

**Week 1-2:** Phase 1 (fix bugs) + Phase 2 (fix scaffolding)
→ App works end-to-end without crashes

**Week 2-3:** Phase 3.1 + 3.2 (Quotes + Review Requests)
→ Two biggest feature gaps closed

**Week 3-4:** Phase 3.3 (Online Booking)
→ Full job lifecycle: lead → quote → booking → job → invoice → review

**Week 4-5:** First 3 customer onboardings
→ Offer free setup, 30-day trial, hands-on support

**Week 5-8:** Phase 3.4 + 4.1 (Recurring Plans + Client Portal)
→ Upgrade path to higher tiers

**Week 8-12:** Phase 5 (AI Phone Calls)
→ $199/mo tier — biggest differentiator

---

## What To Build Next (In Order)

1. **Phase 1** — Fix AI history bug, fix contact_name, Stripe webhook, env validation ← START HERE
2. **Quotes feature** — Biggest missing feature, biggest value-add for closing deals
3. **Review requests** — Easiest to build, huge value for small businesses
4. **Cal.com booking** — Closes the lead→job loop
5. **Fix scaffolding** — Analytics, Settings, Integrations UI
6. **PriceBook → AI RAG** — Makes AI actually quote accurately
7. **Client Portal** — Differentiator vs Jobber/HCP at the tier
8. **AI Phone Calls** — Biggest moat, hardest to copy
