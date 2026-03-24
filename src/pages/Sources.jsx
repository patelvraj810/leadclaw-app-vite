import React from 'react';
import { useNavigate } from 'react-router-dom';

const SOURCES = [
  { icon: '🌐', name: 'Website Form', desc: 'Embed a chat widget or lead form on your site', status: 'available' },
  { icon: '📘', name: 'Facebook Ads', desc: 'Auto-capture leads from Facebook Lead Ads', status: 'available' },
  { icon: '📢', name: 'Google Ads', desc: 'Sync leads from Google lead form extensions', status: 'available' },
  { icon: '📸', name: 'Instagram DMs', desc: 'AI replies to Instagram DMs automatically', status: 'available' },
  { icon: '💬', name: 'WhatsApp Business', desc: 'Inbound WhatsApp messages go to your AI agent', status: 'active' },
  { icon: '📧', name: 'Email', desc: 'Capture leads from email inquiries', status: 'available' },
  { icon: '🏠', name: 'HomeStars 🍁', desc: 'Import leads from HomeStars reviews', status: 'coming' },
  { icon: '📋', name: 'Kijiji 🍁', desc: 'Capture leads from Kijiji service listings', status: 'coming' },
  { icon: '👥', name: 'Facebook Groups', desc: 'Monitor and respond to local group posts', status: 'coming' },
  { icon: '📱', name: 'SMS', desc: 'Inbound SMS routed to your AI agent', status: 'available' },
  { icon: '📲', name: 'Manual Import', desc: 'Upload a CSV of contacts to add as leads', status: 'available' },
  { icon: '🤝', name: 'Referrals', desc: 'Track word-of-mouth and referral leads', status: 'coming' },
];

const STATUS_LABEL = {
  active: { label: 'Active', color: 'var(--green)' },
  available: { label: 'Connect', color: 'var(--text2)' },
  coming: { label: 'Coming soon', color: 'var(--text3)' },
};

export function Sources() {
  const navigate = useNavigate();

  return (
    <div className="page active" id="p-sources" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Lead Sources</h2>
          <p style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>
            Connect the channels where your customers find you. Each connected source routes leads to your AI agent automatically.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {SOURCES.map((src) => {
            const s = STATUS_LABEL[src.status];
            return (
              <div
                key={src.name}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  opacity: src.status === 'coming' ? 0.6 : 1,
                }}
              >
                <span style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{src.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{src.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px', lineHeight: 1.4 }}>{src.desc}</div>
                </div>
                <button
                  onClick={() => src.status !== 'coming' && navigate('/app/integrations')}
                  disabled={src.status === 'coming'}
                  style={{
                    flexShrink: 0,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${s.color}`,
                    background: 'transparent',
                    color: s.color,
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: src.status === 'coming' ? 'default' : 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', padding: '14px 16px', background: 'var(--surface2)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6 }}>
          💡 To configure connected sources, go to <button onClick={() => navigate('/app/integrations')} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: '12px' }}>Integrations</button>. Active sources automatically push leads into your AI pipeline.
        </div>
      </div>
    </div>
  );
}
