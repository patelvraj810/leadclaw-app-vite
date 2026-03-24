import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Send, MessageSquare, Mail, Users } from 'lucide-react';

const CAMPAIGN_TYPES = [
  { icon: <MessageSquare size={20} />, name: 'WhatsApp Blast', desc: 'Send a message to all leads in a status (e.g. "following up" with unqualified leads)', available: true },
  { icon: <Mail size={20} />, name: 'Email Sequence', desc: '3-touch automated email follow-up sequence for new leads', available: true },
  { icon: <Users size={20} />, name: 'Re-engagement', desc: 'Automatically re-engage cold leads after 7 days of no response', available: true },
  { icon: <Send size={20} />, name: 'Win-back', desc: 'Follow up with leads marked as lost after 30 days', available: false },
  { icon: <MessageSquare size={20} />, name: 'Review Request', desc: 'Send a review request to completed jobs via WhatsApp or SMS', available: false },
];

export function Campaigns() {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="page active" id="p-camp" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Campaigns</h2>
            <p style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>
              Outreach sequences your AI agent runs automatically — no manual work.
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: 'var(--r)', border: 'none',
              background: 'var(--text)', color: 'var(--bg)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            <Plus size={14} />
            New Campaign
          </button>
        </div>

        {showNew && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '20px', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Choose a campaign type</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
              {CAMPAIGN_TYPES.map((t) => (
                <button
                  key={t.name}
                  disabled={!t.available}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '14px', borderRadius: 'var(--r)',
                    border: '1px solid var(--border)', background: 'var(--surface2)',
                    textAlign: 'left', cursor: t.available ? 'pointer' : 'not-allowed',
                    opacity: t.available ? 1 : 0.5,
                  }}
                  onClick={() => t.available && alert('Campaign builder coming in the next update!')}
                >
                  <span style={{ color: 'var(--text2)', marginTop: '2px', flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>
                      {t.name} {!t.available && <span style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 400 }}>· coming soon</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '3px', lineHeight: 1.5 }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNew(false)}
              style={{ marginTop: '16px', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '13px' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Empty state when no active campaigns */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '40vh', gap: '12px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px' }}>📣</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
            No active campaigns
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '340px', lineHeight: 1.6 }}>
            Create a campaign to automate follow-up sequences. Your AI agent handles all the messages — you just watch leads warm up.
          </div>
          <button
            onClick={() => setShowNew(true)}
            style={{
              marginTop: '8px', padding: '10px 20px',
              borderRadius: 'var(--r)', border: '1px solid var(--border)',
              background: 'var(--surface)', color: 'var(--text)',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            Create first campaign →
          </button>
        </div>
      </div>
    </div>
  );
}
