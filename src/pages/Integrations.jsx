import React from 'react';
import { Tag } from '../components/ui/Tag';

// Integration catalog — statuses are static (no fake connected states).
// Stripe is marked connected since it's configured in the backend.
// All others show "Not connected" until actual OAuth/API key flows are built.

const CATALOG = [
  {
    section: 'Accounting',
    items: [
      { key: 'quickbooks',  name: 'QuickBooks Online', desc: 'Sync invoices, payments, and customers automatically.', icon: '🧾', connected: false },
      { key: 'wave',        name: 'Wave Accounting',   desc: 'Free accounting software popular with small trades.', icon: '🌊', connected: false, canadian: true },
      { key: 'freshbooks',  name: 'FreshBooks',        desc: 'Invoicing and time tracking for service businesses.', icon: '📒', connected: false, canadian: true },
    ],
  },
  {
    section: 'Calendar',
    items: [
      { key: 'gcal',    name: 'Google Calendar',   desc: 'Sync booked jobs and appointments automatically.', icon: '📅', connected: false },
      { key: 'apple',   name: 'Apple Calendar',    desc: 'Push confirmed jobs to your Apple Calendar.',      icon: '🍎', connected: false },
      { key: 'outlook', name: 'Outlook Calendar',  desc: 'Sync with Microsoft Outlook for teams.',           icon: '📆', connected: false },
    ],
  },
  {
    section: 'Payments',
    items: [
      { key: 'stripe',   name: 'Stripe',             desc: 'Accept card payments and deposits. Connected via Stripe.', icon: '💳', connected: true },
      { key: 'square',   name: 'Square',              desc: 'In-person and online payments for field service.',         icon: '⬛', connected: false },
      { key: 'interac',  name: 'Interac e-Transfer',  desc: 'Canadian e-Transfer support for invoices.',               icon: '🍁', connected: false, canadian: true },
    ],
  },
  {
    section: 'Lead Sources',
    items: [
      { key: 'homestars',  name: 'HomeStars',       desc: 'Canada\'s top home improvement review platform.',    icon: '⭐', connected: false, canadian: true },
      { key: 'kijiji',     name: 'Kijiji',          desc: 'Canada\'s largest classifieds — capture inbound leads.', icon: '🗂️', connected: false, canadian: true },
      { key: 'thumbtack',  name: 'Thumbtack',       desc: 'Connect with homeowners seeking local pros.',        icon: '📌', connected: false },
      { key: 'google_ads', name: 'Google Ads',      desc: 'Automatically pull in leads from Google Ads forms.', icon: '🔍', connected: false },
      { key: 'fb_ads',     name: 'Facebook Ads',    desc: 'Import leads from Facebook Lead Gen campaigns.',     icon: '📘', connected: false },
      { key: 'nextdoor',   name: 'Nextdoor',        desc: 'Capture neighbour referral and service requests.',   icon: '🏘️', connected: false },
    ],
  },
  {
    section: 'Communication',
    items: [
      { key: 'zapier',     name: 'Zapier',       desc: 'Connect Matchit to 5,000+ apps via automated workflows.', icon: '⚡', connected: false },
      { key: 'slack',      name: 'Slack',        desc: 'Receive lead alerts and daily summaries in Slack.',       icon: '💬', connected: false },
      { key: 'mailchimp',  name: 'Mailchimp',    desc: 'Sync qualified leads to email marketing lists.',          icon: '✉️', connected: false },
    ],
  },
  {
    section: 'Reviews',
    items: [
      { key: 'google_reviews', name: 'Google Reviews',    desc: 'Automatically request reviews from completed jobs.', icon: '⭐', connected: false },
      { key: 'yelp',           name: 'Yelp',              desc: 'Auto-request Yelp reviews after service completion.',  icon: '🟥', connected: false },
      { key: 'homestars_rev',  name: 'HomeStars Reviews', desc: 'Request and manage HomeStars ratings.',               icon: '🏅', connected: false, canadian: true },
    ],
  },
];

function IntCard({ item }) {
  const handleConnect = () => {
    if (item.connected) return;
    alert(`${item.name} integration coming soon. We'll notify you when it's available.`);
  };

  return (
    <div className="int-card">
      <div className="int-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: item.connected ? 'var(--green-bg)' : 'var(--surface2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
          }}>
            {item.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</span>
              {item.canadian && <span style={{ fontSize: '11px' }} title="Canadian priority">🍁</span>}
            </div>
            <Tag color={item.connected ? 'green' : 'gray'} style={{ fontSize: '10px', marginTop: '2px' }}>
              {item.connected ? 'Connected' : 'Not connected'}
            </Tag>
          </div>
        </div>
        <button
          className={`btn btn-ghost btn-sm`}
          onClick={handleConnect}
          disabled={item.connected}
          style={item.connected ? { cursor: 'default', opacity: 0.55 } : {}}
        >
          {item.connected ? 'Connected' : 'Connect'}
        </button>
      </div>
      <div className="int-body">
        <p>{item.desc}</p>
      </div>
    </div>
  );
}

export function Integrations() {
  return (
    <div className="page active" id="p-int" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>
        {CATALOG.map(section => (
          <div key={section.section} style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: "'JetBrains Mono', monospace", marginBottom: '12px' }}>
              {section.section}
            </div>
            <div className="int-grid">
              {section.items.map(item => (
                <IntCard key={item.key} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
