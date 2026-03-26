import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAgentSettings, saveAgentSettings, fetchChannels } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { PageHero } from '../components/ui/PageHero';

const TABS = [
  { key: 'profile',       label: 'Profile' },
  { key: 'channels',      label: 'Channels' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'billing',       label: 'Billing' },
  { key: 'account',       label: 'Account' },
];

const INDUSTRIES = [
  'HVAC', 'Plumbing', 'Electrical', 'Landscaping', 'Cleaning',
  'Roofing', 'General Contracting', 'Pest Control', 'Painting', 'Other',
];

const PLANS = [
  { key: 'starter',  name: 'Starter',  price: 49,  features: ['Up to 100 leads/mo', 'Email channel', 'AI agent (Qualifier mode)', 'Basic analytics'] },
  { key: 'pro',      name: 'Pro',       price: 99,  features: ['Up to 500 leads/mo', 'Email + SMS channels', 'Full AI modes', 'Advanced analytics', 'Price book'] },
  { key: 'premium',  name: 'Premium',   price: 199, features: ['Up to 2,000 leads/mo', 'All channels', 'Priority support', 'Custom integrations', 'Jobs scheduling'] },
  { key: 'business', name: 'Business',  price: 499, features: ['Unlimited leads', 'All channels', 'Dedicated account manager', 'White-label option', 'API access'] },
];

const CHANNEL_CATALOG = [
  { key: 'email',       name: 'Email',                    desc: 'Automated email follow-ups via Resend.',         alwaysConnected: true },
  { key: 'whatsapp',    name: 'WhatsApp',                 desc: 'Send and receive messages on WhatsApp Business.' },
  { key: 'sms',         name: 'SMS',                      desc: 'Two-way SMS via Twilio or similar.' },
  { key: 'instagram',   name: 'Instagram DMs',            desc: 'Reply to Instagram DM inquiries automatically.' },
  { key: 'facebook',    name: 'Facebook Messenger',       desc: 'Handle Facebook Messenger leads automatically.' },
  { key: 'webchat',     name: 'Web Chat Widget',          desc: 'Embed a live chat widget on your website.' },
  { key: 'google_biz',  name: 'Google Business Messages', desc: 'Respond to Google Business profile messages.' },
];

function ProfileTab() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [serviceArea, setServiceArea] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgentSettings()
      .then(data => {
        if (data) {
          setBusinessName(data.business_name || '');
          setServiceArea(data.service_area || '');
          setIndustry(data.industry || '');
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setStatus('saving');
    setError('');
    try {
      await saveAgentSettings({
        business_name: businessName,
        service_area: serviceArea,
        industry,
        owner_name: ownerName,
        owner_phone: phone,
      });
      setStatus('saved');
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to save.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px' }}>
      <Card>
        <CardHeader><CardTitle>Business profile</CardTitle></CardHeader>
        <CardBody>
          <div className="field"><label>Business name</label><input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. Mike's HVAC" /></div>
          <div className="field"><label>Owner name</label><input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Your name" /></div>
          <div className="field"><label>Email <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 400 }}>(read-only)</span></label><input type="email" value={user?.email || ''} readOnly disabled style={{ background: 'var(--surface2)', cursor: 'not-allowed' }} /></div>
          <div className="field"><label>Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 416 555 0100" /></div>
          <div className="field"><label>Service area</label><input type="text" value={serviceArea} onChange={e => setServiceArea(e.target.value)} placeholder="e.g. Greater Toronto Area" /></div>
          <div className="field">
            <label>Industry</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)}>
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i.toLowerCase().replace(/ /g, '_')}>{i}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <button className="btn btn-dark" onClick={handleSave} disabled={status === 'saving'}>
              {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save profile'}
            </button>
            {status === 'error' && <span style={{ fontSize: '13px', color: 'var(--red)' }}>{error}</span>}
            {status === 'saved' && <span style={{ fontSize: '13px', color: 'var(--green)' }}>Profile saved.</span>}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Which channels have a real setup guide in Integrations
const CHANNEL_SETUP_TYPE = {
  whatsapp: 'env',       // configured via Meta Cloud API keys
  sms:      'api_key',   // Twilio
  email:    'always_on',
  instagram: 'coming_soon',
  facebook:  'coming_soon',
  webchat:   'webhook',
  google_biz: 'coming_soon',
};

function ChannelsTab() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState({});

  useEffect(() => {
    fetchChannels()
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(c => { map[c.type || c.key] = c; });
          setChannels(map);
        } else if (data && typeof data === 'object') {
          setChannels(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '720px' }}>
      <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '4px', lineHeight: 1.6 }}>
        Channel connection setup is managed in <button onClick={() => navigate('/app/integrations')} style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: '13px', padding: 0, textDecoration: 'underline' }}>Integrations</button>. This view shows the current connection status.
      </div>
      {CHANNEL_CATALOG.map(ch => {
        const connData = channels[ch.key];
        const isConnected = ch.alwaysConnected || !!(connData?.connected || connData?.enabled);
        const setupType = CHANNEL_SETUP_TYPE[ch.key];
        const isComingSoon = setupType === 'coming_soon';

        return (
          <Card key={ch.key}>
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{ch.name}</span>
                    <Tag color={isConnected ? 'green' : isComingSoon ? 'gray' : 'gray'} style={{ fontSize: '10px' }}>
                      {isConnected ? 'Connected' : isComingSoon ? 'Coming soon' : 'Not connected'}
                    </Tag>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{ch.desc}</div>
                  {ch.key === 'whatsapp' && connData?.phone_number && (
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                      {connData.phone_number}
                    </div>
                  )}
                </div>
                {ch.alwaysConnected && (
                  <span style={{ fontSize: '12px', color: 'var(--text3)', flexShrink: 0 }}>Always on</span>
                )}
                {!ch.alwaysConnected && !isComingSoon && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate('/app/integrations')}
                    style={{ flexShrink: 0, fontSize: '12px' }}
                  >
                    {isConnected ? 'Manage →' : 'Set up →'}
                  </button>
                )}
                {isComingSoon && (
                  <span style={{ fontSize: '11px', color: 'var(--text3)', flexShrink: 0 }}>Roadmap</span>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

const NOTIF_STORAGE_KEY = 'matchit_notification_prefs';
const NOTIF_DEFAULT_PREFS = {
  morning_briefing: false,
  morning_phone: '',
  eod_summary: false,
  eod_phone: '',
  new_lead_alert: false,
  new_lead_phone: '',
  appt_reminder_24h: false,
  appt_reminder_2h: false,
  appt_reminder_30m: false,
};

function NotifToggle({ field, prefs, onToggle }) {
  return (
    <div
      onClick={() => onToggle(field)}
      style={{
        width: '36px', height: '20px', borderRadius: '10px', flexShrink: 0,
        background: prefs[field] ? 'var(--green)' : 'var(--surface3)',
        cursor: 'pointer', position: 'relative', transition: 'background .2s',
      }}
    >
      <div style={{
        width: '14px', height: '14px', borderRadius: '50%', background: '#fff',
        position: 'absolute', top: '3px',
        left: prefs[field] ? '19px' : '3px', transition: 'left .2s',
      }} />
    </div>
  );
}

function NotifRow({ label, toggleKey, phoneKey, prefs, onToggle, onField }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: '500' }}>{label}</div>
        {phoneKey && prefs[toggleKey] && (
          <input
            type="tel"
            value={prefs[phoneKey]}
            onChange={e => onField(phoneKey, e.target.value)}
            placeholder="+1 416 555 0100"
            style={{ marginTop: '8px', maxWidth: '220px' }}
          />
        )}
      </div>
      <NotifToggle field={toggleKey} prefs={prefs} onToggle={onToggle} />
    </div>
  );
}

function NotificationsTab() {
  // NOTE: Backend does not yet have a /api/notifications endpoint.
  // Notification preferences are saved to localStorage for now.
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
      return stored ? { ...NOTIF_DEFAULT_PREFS, ...JSON.parse(stored) } : NOTIF_DEFAULT_PREFS;
    } catch {
      return NOTIF_DEFAULT_PREFS;
    }
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const setField = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ maxWidth: '560px' }}>
      <Card>
        <CardHeader><CardTitle>WhatsApp notifications</CardTitle></CardHeader>
        <CardBody>
          <NotifRow label="Morning briefing (7am daily)" toggleKey="morning_briefing" phoneKey="morning_phone" prefs={prefs} onToggle={toggle} onField={setField} />
          <NotifRow label="End-of-day summary (6pm daily)" toggleKey="eod_summary" phoneKey="eod_phone" prefs={prefs} onToggle={toggle} onField={setField} />
          <NotifRow label="New lead alert (instant)" toggleKey="new_lead_alert" phoneKey="new_lead_phone" prefs={prefs} onToggle={toggle} onField={setField} />
          <div style={{ padding: '12px 0', borderBottom: 'none' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Appointment reminders</div>
            {[
              { label: '24 hours before', key: 'appt_reminder_24h' },
              { label: '2 hours before',  key: 'appt_reminder_2h' },
              { label: '30 minutes before', key: 'appt_reminder_30m' },
            ].map(r => (
              <div key={r.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{r.label}</span>
                <NotifToggle field={r.key} prefs={prefs} onToggle={toggle} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <button className="btn btn-dark" onClick={handleSave}>Save preferences</button>
            {saved && <span style={{ fontSize: '13px', color: 'var(--green)' }}>Saved!</span>}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px' }}>
            Preferences saved locally — will sync to server once notification API is available.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function BillingTab({ user }) {
  const currentPlan = user?.subscription_tier || user?.plan || 'starter';

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {PLANS.map(plan => {
          const isCurrent = currentPlan === plan.key;
          return (
            <div
              key={plan.key}
              style={{
                background: isCurrent ? 'var(--text)' : 'var(--surface)',
                border: `1px solid ${isCurrent ? 'var(--text)' : 'var(--border)'}`,
                borderRadius: 'var(--rl)',
                padding: '20px',
                position: 'relative',
              }}
            >
              {isCurrent && (
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--green)', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                  Current plan
                </div>
              )}
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '16px', fontWeight: '600', color: isCurrent ? '#fff' : 'var(--text)', marginBottom: '4px' }}>{plan.name}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '32px', fontWeight: '700', color: isCurrent ? '#fff' : 'var(--text)', margin: '8px 0 4px' }}>
                <sup style={{ fontSize: '16px', verticalAlign: 'top', marginTop: '8px', display: 'inline-block' }}>$</sup>{plan.price}
              </div>
              <div style={{ fontSize: '12px', color: isCurrent ? 'rgba(255,255,255,.55)' : 'var(--text3)', marginBottom: '14px' }}>per month</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ fontSize: '12px', color: isCurrent ? 'rgba(255,255,255,.8)' : 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: isCurrent ? 'var(--green)' : 'var(--green)', fontWeight: '700', fontSize: '10px', marginTop: '2px' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {!isCurrent && (
                <a
                  href="mailto:support@matchit.ai?subject=Plan upgrade request"
                  className="btn btn-ghost btn-sm btn-full"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none', color: 'var(--text2)' }}
                >
                  Upgrade to {plan.name}
                </a>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6 }}>
        Plan changes are processed manually. Email <a href="mailto:support@matchit.ai" style={{ color: 'var(--blue)' }}>support@matchit.ai</a> to upgrade, downgrade, or cancel your subscription.
        Self-serve billing portal is on the roadmap.
      </div>
    </div>
  );
}

function AccountTab({ user }) {
  const [confirmText, setConfirmText] = useState('');
  const [showDanger, setShowDanger] = useState(false);
  const tier = user?.subscription_tier || user?.plan || 'starter';

  return (
    <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Workspace overview */}
      <Card>
        <CardHeader><CardTitle>Workspace</CardTitle></CardHeader>
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            {[
              { label: 'Business name', value: user?.business_name || '—' },
              { label: 'Owner email',   value: user?.email || '—' },
              { label: 'Industry',      value: user?.industry || '—' },
              { label: 'Plan',          value: tier.charAt(0).toUpperCase() + tier.slice(1) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--surface3)' }}>
                <span style={{ color: 'var(--text3)' }}>{label}</span>
                <span style={{ fontWeight: '500', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text3)' }}>
            To update these details, go to the Profile tab.
          </div>
        </CardBody>
      </Card>

      {/* Data & privacy */}
      <Card>
        <CardHeader><CardTitle>Data & privacy</CardTitle></CardHeader>
        <CardBody>
          <p style={{ fontSize: '13px', color: 'var(--text2)', margin: '0 0 12px', lineHeight: 1.7 }}>
            Matchit stores your business data, leads, conversations, and job history securely in our cloud database with row-level security. Your data is never shared with other businesses.
          </p>
          <a
            href="mailto:support@matchit.ai?subject=Data export request"
            className="btn btn-ghost btn-sm"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Request data export
          </a>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '8px', lineHeight: 1.5 }}>
            Data exports are processed manually within 5 business days. You will receive a download link at your account email.
          </div>
        </CardBody>
      </Card>

      {/* Danger zone */}
      <Card style={{ border: '1px solid #fecaca' }}>
        <CardHeader>
          <CardTitle style={{ color: 'var(--red)' }}>Danger zone</CardTitle>
        </CardHeader>
        <CardBody>
          <p style={{ fontSize: '13px', color: 'var(--text2)', margin: '0 0 14px', lineHeight: 1.7 }}>
            Closing your account permanently deletes all your business data, leads, conversations, jobs, estimates, and team members. <strong>This cannot be undone.</strong>
          </p>
          {!showDanger ? (
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--red)', borderColor: '#fecaca' }}
              onClick={() => setShowDanger(true)}
            >
              Close account…
            </button>
          ) : (
            <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 'var(--r)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--red)' }}>
                ⚠ This will permanently delete your workspace
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>
                To confirm, type <strong>DELETE MY ACCOUNT</strong> below:
              </div>
              <input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                style={{ borderColor: '#fecaca' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-sm"
                  style={{
                    background: confirmText === 'DELETE MY ACCOUNT' ? 'var(--red)' : 'var(--surface3)',
                    color: confirmText === 'DELETE MY ACCOUNT' ? '#fff' : 'var(--text3)',
                    border: 'none',
                    cursor: confirmText === 'DELETE MY ACCOUNT' ? 'pointer' : 'not-allowed',
                  }}
                  disabled={confirmText !== 'DELETE MY ACCOUNT'}
                  onClick={() => {
                    window.location.href = 'mailto:support@matchit.ai?subject=Account deletion request&body=Business name: ' + encodeURIComponent(user?.business_name || '');
                  }}
                >
                  Send deletion request
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setShowDanger(false); setConfirmText(''); }}
                >
                  Cancel
                </button>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.5 }}>
                This will open your email client with a pre-filled deletion request. Our team processes deletions within 24 hours to protect against unauthorized requests.
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export function Settings() {
  const [tab, setTab] = useState('profile');
  const { user } = useAuth();

  return (
    <div className="page active surface-page settings-page" id="p-settings">
      <PageHero
        className="settings-hero"
        eyebrow="Workspace control"
        title="Settings"
        subtitle="Keep your business profile, channels, notifications, billing context, and account controls in one consistent place."
        stat={{ value: TABS.length, label: 'configuration areas' }}
      />

        <div className="settings-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`settings-tab${tab === t.key ? ' active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile'       && <ProfileTab />}
        {tab === 'channels'      && <ChannelsTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'billing'       && <BillingTab user={user} />}
        {tab === 'account'       && <AccountTab user={user} />}
    </div>
  );
}
