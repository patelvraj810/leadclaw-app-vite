import { useState, useEffect } from 'react';
import { Tag } from '../components/ui/Tag';
import { PageHero } from '../components/ui/PageHero';
import { fetchIntegrations, seedIntegrations, updateIntegration, disconnectIntegration } from '../lib/api';

// Static catalog — defines setup notes and metadata.
// Actual connection status is merged from the backend at runtime.
const CATALOG = [
  {
    section: 'Payments',
    priority: true,
    items: [
      {
        key: 'stripe',
        name: 'Stripe',
        desc: 'Accept card payments and deposits on invoices and estimates.',
        icon: '💳',
        setupType: 'env',
        setup: 'Configured via STRIPE_SECRET_KEY in backend. Payment links generated automatically on invoices and estimate deposits.',
        canDisconnect: false,
      },
      {
        key: 'square',
        name: 'Square',
        desc: 'In-person and online payments for field service.',
        icon: '⬛',
        setupType: 'api_key',
        setup: 'Requires SQUARE_ACCESS_TOKEN in backend .env. Not yet implemented.',
        canDisconnect: false,
      },
      {
        key: 'interac',
        name: 'Interac e-Transfer',
        desc: 'Add your Interac email to invoices so customers can pay directly. No API needed.',
        icon: '🍁',
        setupType: 'manual',
        setup: 'No API. Add your Interac email to invoice notes or message templates.',
        canadian: true,
        canDisconnect: false,
      },
    ],
  },
  {
    section: 'Messaging',
    priority: true,
    items: [
      {
        key: 'whatsapp',
        name: 'WhatsApp Business',
        desc: 'AI agent sends and receives messages to leads via WhatsApp.',
        icon: '💬',
        setupType: 'env',
        setup: 'Configured via WHATSAPP_TOKEN and WHATSAPP_PHONE_ID. Inbound webhook at POST /webhook/whatsapp.',
        canDisconnect: false,
      },
      {
        key: 'twilio',
        name: 'Twilio (SMS / Find)',
        desc: 'SMS fallback and Matchit Find customer confirmations.',
        icon: '📱',
        setupType: 'env',
        setup: 'Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER in backend .env.',
        canDisconnect: false,
      },
      {
        key: 'resend',
        name: 'Resend Email',
        desc: 'Transactional email for invoices and notifications.',
        icon: '✉️',
        setupType: 'api_key',
        setup: 'Configured via RESEND_API_KEY in backend.',
        canDisconnect: false,
      },
    ],
  },
  {
    section: 'AI',
    items: [
      {
        key: 'gemini',
        name: 'Google Gemini AI',
        desc: 'Powers the AI agent — lead qualification, follow-ups, and conversation intelligence.',
        icon: '🤖',
        setupType: 'api_key',
        setup: 'Configured via GEMINI_API_KEY in backend. Using Flash-Lite model.',
        canDisconnect: false,
      },
    ],
  },
  {
    section: 'Calendar',
    priority: true,
    items: [
      {
        key: 'gcal',
        name: 'Google Calendar',
        desc: 'Sync booked jobs and appointments to Google Calendar.',
        icon: '📅',
        setupType: 'oauth',
        setup: 'Requires Google OAuth 2.0 + calendar.events scope. Not yet implemented — planned next milestone.',
        canDisconnect: false,
      },
      {
        key: 'outlook',
        name: 'Outlook Calendar',
        desc: 'Sync with Microsoft Outlook for teams using Microsoft 365.',
        icon: '📆',
        setupType: 'oauth',
        setup: 'Requires Microsoft Graph API OAuth. Not yet implemented.',
        canDisconnect: false,
      },
    ],
  },
  {
    section: 'Accounting',
    items: [
      {
        key: 'quickbooks',
        name: 'QuickBooks Online',
        desc: 'Sync invoices, payments, and customers automatically.',
        icon: '🧾',
        setupType: 'oauth',
        setup: 'Requires QuickBooks OAuth 2.0 flow. Not yet implemented — high priority for billing milestone.',
        canadian: true,
        canDisconnect: false,
      },
      {
        key: 'wave',
        name: 'Wave Accounting',
        desc: 'Free accounting software popular with small trades.',
        icon: '🌊',
        setupType: 'oauth',
        setup: 'Requires Wave OAuth. Not yet implemented.',
        canadian: true,
        canDisconnect: false,
      },
    ],
  },
  {
    section: 'Lead Sources',
    items: [
      {
        key: 'google_ads',
        name: 'Google Ads',
        desc: 'Pull leads from Google Ads lead form extensions.',
        icon: '🔍',
        setupType: 'webhook',
        setup: 'Use Google Ads webhook or Zapier → POST /webhook/inbound with source=google_ads.',
        canDisconnect: false,
      },
      {
        key: 'fb_ads',
        name: 'Facebook Lead Ads',
        desc: 'Import leads from Facebook Lead Gen campaigns.',
        icon: '📘',
        setupType: 'webhook',
        setup: 'Use Zapier → POST /webhook/inbound with source=facebook.',
        canDisconnect: false,
      },
      {
        key: 'homestars',
        name: 'HomeStars',
        desc: "Canada's top home improvement review and lead platform.",
        icon: '⭐',
        setupType: 'manual',
        setup: 'No official API. Use manual import or Zapier with HomeStars email notifications as trigger.',
        canadian: true,
        canDisconnect: false,
      },
      {
        key: 'zapier',
        name: 'Zapier',
        desc: 'Connect Matchit to 5,000+ apps via automated workflows.',
        icon: '⚡',
        setupType: 'webhook',
        setup: 'POST to /webhook/inbound with contact_name, contact_phone, message, source + Bearer token.',
        canDisconnect: false,
      },
    ],
  },
  {
    section: 'Reviews',
    items: [
      {
        key: 'google_reviews',
        name: 'Google Reviews',
        desc: 'Add your Google review link to campaigns and AI follow-up messages.',
        icon: '⭐',
        setupType: 'manual',
        setup: 'No API needed. Copy your Google review shortlink and save it in Agent Setup → google_review_link.',
        canDisconnect: false,
      },
    ],
  },
];

const SETUP_TYPE_LABELS = {
  env:      { label: 'Backend env',     color: 'blue' },
  oauth:    { label: 'OAuth',           color: 'amber' },
  webhook:  { label: 'Webhook',         color: 'blue' },
  api_key:  { label: 'API key',         color: 'amber' },
  manual:   { label: 'Manual / No API', color: 'gray' },
};

function statusLabel(status) {
  if (status === 'connected') return { label: 'Connected', color: 'green' };
  if (status === 'error')     return { label: 'Error', color: 'red' };
  if (status === 'pending')   return { label: 'Pending', color: 'amber' };
  return { label: 'Not connected', color: 'gray' };
}

function IntCard({ item, liveState, onDisconnect }) {
  const [expanded, setExpanded] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const stl    = SETUP_TYPE_LABELS[item.setupType] || { label: item.setupType, color: 'gray' };
  const live   = liveState?.status || 'disconnected';
  const sl     = statusLabel(live);
  const isConn = live === 'connected';

  const handleDisconnect = async () => {
    if (!window.confirm(`Disconnect ${item.name}?`)) return;
    setDisconnecting(true);
    try { await onDisconnect(item.key); } finally { setDisconnecting(false); }
  };

  return (
    <div className="int-card" style={{ opacity: isConn ? 1 : 0.88 }}>
      <div className="int-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: isConn ? 'rgba(22,163,74,0.08)' : 'var(--surface2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
          }}>
            {item.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</span>
              {item.canadian && <span style={{ fontSize: '11px' }} title="Canadian priority">🍁</span>}
            </div>
            <div style={{ display: 'flex', gap: '5px', marginTop: '3px', flexWrap: 'wrap' }}>
              <Tag color={sl.color} style={{ fontSize: '10px' }}>{sl.label}</Tag>
              <Tag color={stl.color} style={{ fontSize: '10px' }}>{stl.label}</Tag>
            </div>
            {liveState?.account_label && (
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px', fontFamily: "'JetBrains Mono', monospace" }}>
                {liveState.account_label}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {isConn && item.canDisconnect !== false && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
              style={{ fontSize: '11px', color: 'var(--red)' }}
            >
              {disconnecting ? '…' : 'Disconnect'}
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(v => !v)}>
            {expanded ? 'Less' : isConn ? 'Details' : 'Setup guide'}
          </button>
        </div>
      </div>

      <div className="int-body">
        <p style={{ marginBottom: expanded ? '10px' : '0' }}>{item.desc}</p>
        {expanded && (
          <div style={{
            padding: '12px 14px', background: 'var(--surface2)', borderRadius: '8px',
            fontSize: '12px', color: 'var(--text2)', lineHeight: 1.7,
          }}>
            {isConn
              ? <span style={{ color: 'var(--green)', fontWeight: '600' }}>✓ Connected — </span>
              : <span style={{ color: 'var(--amber)', fontWeight: '600' }}>Setup required — </span>
            }
            {item.setup}
            {liveState?.last_sync_at && (
              <div style={{ marginTop: '4px', color: 'var(--text3)' }}>
                Last synced: {new Date(liveState.last_sync_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            {liveState?.error_message && (
              <div style={{ marginTop: '6px', color: 'var(--red)' }}>Error: {liveState.error_message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Integrations() {
  const [liveStates, setLiveStates] = useState({});
  const [loading, setLoading]       = useState(true);
  const [seeded, setSeeded]         = useState(false);

  useEffect(() => {
    // Load backend integration states, then seed env-detected ones
    fetchIntegrations()
      .then(data => {
        const map = {};
        (Array.isArray(data) ? data : []).forEach(i => { map[i.provider] = i; });
        setLiveStates(map);
        // Seed if no records yet for this workspace
        if (data.length === 0 && !seeded) {
          return seedIntegrations().then(seededData => {
            const seededMap = {};
            (Array.isArray(seededData) ? seededData : []).forEach(i => { seededMap[i.provider] = i; });
            setLiveStates(seededMap);
            setSeeded(true);
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisconnect = async (provider) => {
    await disconnectIntegration(provider);
    setLiveStates(prev => ({
      ...prev,
      [provider]: { ...(prev[provider] || {}), status: 'disconnected', account_label: null },
    }));
  };

  const allItems = CATALOG.flatMap(s => s.items);
  const connectedItems = allItems.filter(i => liveStates[i.key]?.status === 'connected');

  return (
    <div className="page active" id="p-int">
      <PageHero eyebrow="Config" title="Integrations" subtitle="Connect your channels, payment processor, and booking system." />
      <div>

        {/* Connected summary bar */}
        {!loading && connectedItems.length > 0 && (
          <div style={{
            display: 'flex', gap: '8px', flexWrap: 'wrap',
            marginBottom: '20px', padding: '12px 16px',
            background: 'var(--surface2)', borderRadius: 'var(--r)',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Connected:</span>
            {connectedItems.map(i => (
              <Tag key={i.key} color="green" style={{ fontSize: '11px' }}>
                {i.icon} {i.name}
              </Tag>
            ))}
          </div>
        )}

        {loading && <div className="loading">Loading integrations…</div>}

        {!loading && CATALOG.map(section => (
          <div key={section.section} style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                fontSize: '11px', fontWeight: '600', color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '.1em',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {section.section}
              </div>
              {section.priority && <Tag color="amber" style={{ fontSize: '10px' }}>Priority</Tag>}
            </div>
            <div className="int-grid">
              {section.items.map(item => (
                <IntCard
                  key={item.key}
                  item={item}
                  liveState={liveStates[item.key] || null}
                  onDisconnect={handleDisconnect}
                />
              ))}
            </div>
          </div>
        ))}

        <div style={{
          padding: '14px 16px', background: 'var(--surface2)', borderRadius: 'var(--r)',
          fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6, marginTop: '8px',
        }}>
          <strong style={{ color: 'var(--text2)' }}>Adding a custom integration?</strong> POST to{' '}
          <code style={{ fontFamily: "'JetBrains Mono', monospace", background: 'var(--surface3)', padding: '1px 5px', borderRadius: '4px' }}>
            /webhook/inbound
          </code>{' '}
          with <code style={{ fontFamily: "'JetBrains Mono', monospace", background: 'var(--surface3)', padding: '1px 5px', borderRadius: '4px' }}>
            contact_name, contact_phone, message, source
          </code>{' '}
          plus a Bearer token. Leads flow directly into your AI pipeline.
        </div>
      </div>
    </div>
  );
}
