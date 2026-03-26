import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../components/ui/Tag';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';

const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend.railway.app';

const SOURCES = [
  {
    key: 'whatsapp',
    icon: '💬',
    name: 'WhatsApp Business',
    desc: 'Inbound WhatsApp messages go directly to your AI agent.',
    status: 'active',
    detail: 'Your Meta Cloud API webhook is configured at POST /webhook/whatsapp. All inbound WhatsApp messages are processed by the AI pipeline automatically.',
    setupPath: null,
  },
  {
    key: 'website',
    icon: '🌐',
    name: 'Website Widget / Form',
    desc: 'Embed a lead form or webhook on your site to capture visitors.',
    status: 'available',
    detail: 'webhook',  // special rendering
    setupPath: null,
  },
  {
    key: 'facebook',
    icon: '📘',
    name: 'Facebook Lead Ads',
    desc: 'Auto-capture leads from Facebook Lead Ad campaigns.',
    status: 'available',
    detail: `Connect via Zapier or a Facebook webhook. Configure your Zapier Zap to POST to ${API_URL}/webhook/inbound with fields: contact_name, contact_phone, message, source=facebook. Include your Bearer token in the Authorization header.`,
    setupPath: '/app/integrations',
  },
  {
    key: 'google_ads',
    icon: '🔍',
    name: 'Google Ads',
    desc: 'Sync leads from Google Ads lead form extensions.',
    status: 'available',
    detail: `Use Google Ads lead form webhook or Zapier. POST to ${API_URL}/webhook/inbound with source=google_ads. Include Bearer token header.`,
    setupPath: '/app/integrations',
  },
  {
    key: 'instagram',
    icon: '📸',
    name: 'Instagram DMs',
    desc: 'AI replies to Instagram DMs (via Meta Business Suite).',
    status: 'available',
    detail: 'Instagram DM automation requires Meta Business Suite and a connected WhatsApp Business Account. Route Instagram leads through your Meta account to the same webhook.',
    setupPath: '/app/integrations',
  },
  {
    key: 'email',
    icon: '📧',
    name: 'Email',
    desc: 'Capture leads from email inquiries via Resend.',
    status: 'available',
    detail: 'Inbound email parsing is available via Resend inbound webhooks. Configure your MX records and POST leads to /webhook/inbound with source=email.',
    setupPath: null,
  },
  {
    key: 'sms',
    icon: '📱',
    name: 'SMS',
    desc: 'Inbound SMS routed to your AI agent via Twilio.',
    status: 'available',
    detail: 'Configure Twilio inbound SMS webhook to POST /webhook/inbound with your bearer token. Requires TWILIO_ACCOUNT_SID in backend .env.',
    setupPath: '/app/integrations',
  },
  {
    key: 'manual',
    icon: '📲',
    name: 'Manual Import',
    desc: 'Manually add a lead or import a list of contacts.',
    status: 'available',
    detail: 'Use the Leads page to manually add individual leads, or send a POST to /api/leads with contact_name, contact_phone, message, and source.',
    setupPath: '/app/leads',
  },
  {
    key: 'homestars',
    icon: '🏠',
    name: 'HomeStars 🍁',
    desc: 'Import leads from HomeStars (Canada\'s top home pro platform).',
    status: 'coming',
    detail: 'HomeStars does not currently offer a public API. Workaround: forward HomeStars email notifications through Zapier to your webhook.',
    setupPath: null,
  },
  {
    key: 'kijiji',
    icon: '📋',
    name: 'Kijiji 🍁',
    desc: 'Capture leads from Kijiji service listings.',
    status: 'coming',
    detail: 'No official Kijiji API. Use email parsing or manual import.',
    setupPath: null,
  },
  {
    key: 'referral',
    icon: '🤝',
    name: 'Referrals',
    desc: 'Track word-of-mouth and referral leads.',
    status: 'coming',
    detail: 'Referral tracking planned. For now, add referral leads manually and set source=referral.',
    setupPath: null,
  },
];

const STATUS_CFG = {
  active:    { label: 'Active',       color: 'green' },
  available: { label: 'Not set up',   color: 'gray' },
  coming:    { label: 'Coming soon',  color: 'gray' },
};

// ─── Website Widget Section ───────────────────────────────────────────────────
function WebhookGuide() {
  const [copied, setCopied] = useState('');

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const webhookUrl = `${API_URL}/webhook/inbound`;
  const curlExample = `curl -X POST ${webhookUrl} \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contact_name": "Jane Smith",
    "contact_phone": "+14165550100",
    "message": "I need my AC fixed ASAP",
    "source": "website"
  }'`;

  const embedExample = `<!-- Matchit lead capture form -->
<form id="matchit-form">
  <input name="name" placeholder="Your name" required />
  <input name="phone" placeholder="Phone number" required />
  <textarea name="message" placeholder="What do you need help with?"></textarea>
  <button type="submit">Get a free quote</button>
</form>
<script>
  document.getElementById('matchit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await fetch('${webhookUrl}', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact_name: fd.get('name'),
        contact_phone: fd.get('phone'),
        message: fd.get('message'),
        source: 'website',
      }),
    });
    e.target.reset();
    alert('Request received! We\\'ll be in touch shortly.');
  });
</script>`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>
        Add leads from your website by posting to your inbound webhook. Any form, chatbot, or automation tool that can send a POST request can capture leads directly into your AI pipeline.
      </div>

      <div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>Webhook endpoint</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <code style={{
            flex: 1, padding: '10px 12px',
            background: 'var(--surface3)', borderRadius: '8px',
            fontSize: '12px', fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--text)', wordBreak: 'break-all',
          }}>
            POST {webhookUrl}
          </code>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => copyText(`POST ${webhookUrl}`, 'url')}
          >
            {copied === 'url' ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>Required fields</div>
        <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", lineHeight: 2 }}>
          <div><span style={{ color: 'var(--text2)' }}>contact_name</span> — lead's name</div>
          <div><span style={{ color: 'var(--text2)' }}>contact_phone</span> — WhatsApp number (with country code)</div>
          <div><span style={{ color: 'var(--text2)' }}>message</span> — what they need</div>
          <div><span style={{ color: 'var(--text2)' }}>source</span> — "website", "facebook", "google_ads", etc.</div>
          <div style={{ marginTop: '4px', color: 'var(--text3)' }}>Header: <span style={{ color: 'var(--amber)' }}>Authorization: Bearer YOUR_TOKEN</span></div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)' }}>cURL example</div>
          <button className="btn btn-ghost btn-sm" onClick={() => copyText(curlExample, 'curl')}>
            {copied === 'curl' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre style={{
          background: 'var(--surface3)', borderRadius: '8px', padding: '12px',
          fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text2)', overflow: 'auto', whiteSpace: 'pre-wrap',
          lineHeight: 1.6, margin: 0,
        }}>
          {curlExample}
        </pre>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)' }}>HTML embed example</div>
          <button className="btn btn-ghost btn-sm" onClick={() => copyText(embedExample, 'embed')}>
            {copied === 'embed' ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre style={{
          background: 'var(--surface3)', borderRadius: '8px', padding: '12px',
          fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text2)', overflow: 'auto', whiteSpace: 'pre-wrap',
          lineHeight: 1.6, margin: 0, maxHeight: '200px',
        }}>
          {embedExample}
        </pre>
      </div>
    </div>
  );
}

// ─── Source Card ──────────────────────────────────────────────────────────────
function SourceCard({ source }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const sc = STATUS_CFG[source.status];

  const handleAction = () => {
    if (source.status === 'coming') return;
    setExpanded(v => !v);
  };

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '16px',
      opacity: source.status === 'coming' ? 0.6 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{source.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{source.name}</span>
            <Tag color={sc.color} style={{ fontSize: '10px' }}>{sc.label}</Tag>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.4 }}>{source.desc}</div>
        </div>
        <button
          onClick={handleAction}
          disabled={source.status === 'coming'}
          style={{
            flexShrink: 0, padding: '4px 10px', borderRadius: '6px',
            border: '1px solid var(--border)', background: 'transparent',
            color: source.status === 'active' ? 'var(--green)' : 'var(--text2)',
            fontSize: '11px', fontWeight: '600',
            cursor: source.status === 'coming' ? 'default' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {source.status === 'coming' ? 'Coming soon' : source.status === 'active' ? (expanded ? 'Less' : 'Details') : (expanded ? 'Less' : 'Setup guide')}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
          {source.detail === 'webhook' ? (
            <WebhookGuide />
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.7 }}>
              {source.detail}
              {source.setupPath && (
                <div style={{ marginTop: '8px' }}>
                  <button
                    onClick={() => navigate(source.setupPath)}
                    style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', padding: 0, fontSize: '12px', textDecoration: 'underline' }}
                  >
                    Go to {source.setupPath === '/app/integrations' ? 'Integrations' : source.setupPath === '/app/leads' ? 'Leads' : 'Settings'} →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Sources page ────────────────────────────────────────────────────────
export function Sources() {
  const active  = SOURCES.filter(s => s.status === 'active');
  const available = SOURCES.filter(s => s.status === 'available');
  const coming  = SOURCES.filter(s => s.status === 'coming');

  return (
    <div className="page active" id="p-sources">
      <PageHero eyebrow="Growth" title="Lead Sources" subtitle="Every connected source automatically routes leads into your AI pipeline." />
      <div>
        <div style={{ marginBottom: '24px' }}>
        </div>

        {/* Active sources first */}
        {active.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: "'JetBrains Mono', monospace", marginBottom: '12px' }}>
              Active
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
              {active.map(src => <SourceCard key={src.key} source={src} />)}
            </div>
          </div>
        )}

        {/* Available sources */}
        {available.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: "'JetBrains Mono', monospace", marginBottom: '12px' }}>
              Available to connect
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
              {available.map(src => <SourceCard key={src.key} source={src} />)}
            </div>
          </div>
        )}

        {/* Coming soon */}
        {coming.length > 0 && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: "'JetBrains Mono', monospace", marginBottom: '12px' }}>
              Coming soon
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px' }}>
              {coming.map(src => <SourceCard key={src.key} source={src} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
