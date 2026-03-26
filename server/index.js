/* global process */
// Matchit Backend — Express API
// Handles: POST /api/find/request

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── Supabase ────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ── Twilio WhatsApp ───────────────────────────────────────────────────────
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const FROM_WHATSAPP = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
const OWNER_WHATSAPP = `whatsapp:${process.env.OWNER_WHATSAPP}`; // Vraj's WhatsApp

const CATEGORY_LABELS = {
  hvac: 'HVAC',
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  cleaning: 'Cleaning',
  landscaping: 'Landscaping',
  appliance: 'Appliance',
  other: 'Other',
};

const URGENCY_LABELS = {
  emergency: '🔴 Emergency',
  this_week: '🟡 This week',
  quotes: '🟢 Just getting quotes',
};

// ── POST /api/find/request ─────────────────────────────────────────────────
app.post('/api/find/request', async (req, res) => {
  const { category, urgency, description, whatsapp } = req.body;

  // Validation
  if (!category || !urgency || !whatsapp) {
    return res.status(400).json({ message: 'Missing required fields: category, urgency, whatsapp' });
  }

  const whatsappDigits = whatsapp.replace(/\D/g, '');
  if (whatsappDigits.length < 10) {
    return res.status(400).json({ message: 'Invalid WhatsApp number' });
  }

  try {
    // 1. Save to service_requests table
    const { data: request, error: dbError } = await supabase
      .from('service_requests')
      .insert({
        category,
        urgency,
        description: description || null,
        whatsapp: whatsappDigits,
        status: 'pending',
        source: 'find_page',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return res.status(500).json({ message: 'Failed to save request' });
    }

    const serviceLabel = CATEGORY_LABELS[category] || category;
    const urgencyLabel = URGENCY_LABELS[urgency] || urgency;
    const customerWA = `whatsapp:+1${whatsappDigits}`; // assume Canada/US

    // 2. Send WhatsApp to customer
    const customerMsg = `Hi! I'm Aria from Matchit 👋 Got your request for ${serviceLabel} (${urgencyLabel}). Finding available pros in your area now — give me 2 minutes! Share your location or postal code?`;

    try {
      await twilioClient.messages.create({
        from: FROM_WHATSAPP,
        to: customerWA,
        body: customerMsg,
      });
    } catch (waError) {
      console.error('Twilio customer message error:', waError);
      // Don't fail the request — log and continue
    }

    // 3. Notify owner (Vraj) for manual matching
    const ownerMsg =
      `🆕 New Service Request\n\n` +
      `📋 Service: ${serviceLabel}\n` +
      `⏱️ Urgency: ${urgencyLabel}\n` +
      `📱 WhatsApp: +1${whatsappDigits}\n` +
      `📝 Notes: ${description || 'None'}\n` +
      `🔗 ID: ${request.id}`;

    try {
      await twilioClient.messages.create({
        from: FROM_WHATSAPP,
        to: OWNER_WHATSAPP,
        body: ownerMsg,
      });
    } catch (ownerError) {
      console.error('Twilio owner notification error:', ownerError);
      // Don't fail — owner notification is non-critical
    }

    return res.status(200).json({ success: true, requestId: request.id });
  } catch (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Matchit API running on port ${PORT}`);
});
