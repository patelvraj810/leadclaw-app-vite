import React, { useState, useEffect } from 'react';
import { fetchAgentSettings, saveAgentSettings, fetchChannels } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';

const TABS = [
  { key: 'profile',       label: 'Profile' },
  { key: 'channels',      label: 'Channels' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'billing',       label: 'Billing' },
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
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
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
    if (user) {
      setOwnerName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSave = async () => {
    setStatus('saving');
    setError('');
    try {
      await saveAgentSettings({ business_name: businessName, service_area: serviceArea, industry });
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

function ChannelsTab() {
  const [channels, setChannels] = useState({});

  useEffect(() => {
    fetchChannels()
      .then(data => {
        // data expected to be an object or array of channel configs
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(c => { map[c.type || c.key] = c; });
          setChannels(map);
        } else if (data && typeof data === 'object') {
          setChannels(data);
        }
      })
      .catch(() => {
        // channels endpoint not yet implemented — show all as not connected
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '720px' }}>
      {CHANNEL_CATALOG.map(ch => {
        const connData = channels[ch.key];
        const isConnected = ch.alwaysConnected || !!(connData?.connected || connData?.enabled);
        return (
          <Card key={ch.key}>
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{ch.name}</span>
                    <Tag color={isConnected ? 'green' : 'gray'} style={{ fontSize: '10px' }}>
                      {isConnected ? 'Connected' : 'Not connected'}
                    </Tag>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)' }}>{ch.desc}</div>
                  {ch.key === 'whatsapp' && connData?.phone_number && (
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                      {connData.phone_number}
                    </div>
                  )}
                </div>
                {!ch.alwaysConnected && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => alert(`${ch.name} connection setup coming soon.`)}
                    style={{ flexShrink: 0 }}
                  >
                    {isConnected ? 'Manage' : 'Connect'}
                  </button>
                )}
                {ch.alwaysConnected && (
                  <span style={{ fontSize: '12px', color: 'var(--text3)', flexShrink: 0 }}>Always on</span>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

function NotificationsTab() {
  // NOTE: Backend does not yet have a /api/notifications endpoint.
  // Notification preferences are saved to localStorage for now.
  const STORAGE_KEY = 'matchit_notification_prefs';

  const defaultPrefs = {
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

  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));
  const setField = (key, val) => setPrefs(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ field }) => (
    <div
      onClick={() => toggle(field)}
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

  const Row = ({ label, toggleKey, phoneKey }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: '500' }}>{label}</div>
        {phoneKey && prefs[toggleKey] && (
          <input
            type="tel"
            value={prefs[phoneKey]}
            onChange={e => setField(phoneKey, e.target.value)}
            placeholder="+1 416 555 0100"
            style={{ marginTop: '8px', maxWidth: '220px' }}
          />
        )}
      </div>
      <Toggle field={toggleKey} />
    </div>
  );

  return (
    <div style={{ maxWidth: '560px' }}>
      <Card>
        <CardHeader><CardTitle>WhatsApp notifications</CardTitle></CardHeader>
        <CardBody>
          <Row label="Morning briefing (7am daily)" toggleKey="morning_briefing" phoneKey="morning_phone" />
          <Row label="End-of-day summary (6pm daily)" toggleKey="eod_summary" phoneKey="eod_phone" />
          <Row label="New lead alert (instant)" toggleKey="new_lead_alert" phoneKey="new_lead_phone" />
          <div style={{ padding: '12px 0', borderBottom: 'none' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Appointment reminders</div>
            {[
              { label: '24 hours before', key: 'appt_reminder_24h' },
              { label: '2 hours before',  key: 'appt_reminder_2h' },
              { label: '30 minutes before', key: 'appt_reminder_30m' },
            ].map(r => (
              <div key={r.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{r.label}</span>
                <Toggle field={r.key} />
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
  const currentPlan = user?.plan || 'starter';

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
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '16px', fontWeight: '600', color: isCurrent ? '#fff' : 'var(--text)', marginBottom: '4px' }}>{plan.name}</div>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '32px', fontWeight: '700', color: isCurrent ? '#fff' : 'var(--text)', margin: '8px 0 4px' }}>
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
                <button
                  className="btn btn-ghost btn-sm btn-full"
                  onClick={() => alert(`Upgrade to ${plan.name} coming soon. Contact support to change your plan.`)}
                  style={isCurrent ? { background: 'rgba(255,255,255,.12)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' } : {}}
                >
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Settings() {
  const [tab, setTab] = useState('profile');
  const { user } = useAuth();

  return (
    <div className="page active" id="p-settings" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid var(--text)' : '2px solid transparent',
                color: tab === t.key ? 'var(--text)' : 'var(--text2)',
                fontFamily: "'Satoshi', sans-serif",
                marginBottom: '-1px',
                transition: 'color .15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile'       && <ProfileTab />}
        {tab === 'channels'      && <ChannelsTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'billing'       && <BillingTab user={user} />}
      </div>
    </div>
  );
}
