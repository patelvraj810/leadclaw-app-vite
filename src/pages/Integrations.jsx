import React from 'react';

export function Integrations() {
  const copyWebhook = () => {
    navigator.clipboard.writeText('https://app.leadclaw.io/webhook/abc123')
      .then(() => alert('Copied!'));
  };

  return (
    <div className="page active" id="p-int">
      <div className="topbar">
        <div>
          <div className="tb-title">Integrations</div>
          <div className="tb-sub">Connect your channels and tools</div>
        </div>
      </div>
      <div style={{ padding: '22px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13px' }}>

          <div className="card"><div className="ch"><div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><div style={{ width: '34px', height: '34px', background: '#ea4335', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✉</div><div><div className="ct">Email (Resend)</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>All plans · Recommended</div></div></div><span className="tag tag-green">Connected</span></div><div className="cb"><div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>AI responds via your business email. Free up to 3,000 emails/day.</div><button className="btn btn-ghost btn-sm">Configure</button></div></div>

          <div className="card"><div className="ch"><div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><div style={{ width: '34px', height: '34px', background: '#25d366', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📱</div><div><div className="ct">WhatsApp (Meta Cloud API)</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Pro plan · Free to connect</div></div></div><span className="tag tag-green">Connected</span></div><div className="cb"><div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>Direct Meta Cloud API — no Twilio markup. Conversations are free when lead messages first.</div><button className="btn btn-ghost btn-sm">Configure</button></div></div>

          <div className="card"><div className="ch"><div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><div style={{ width: '34px', height: '34px', background: '#e1306c', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📸</div><div><div className="ct">Instagram DMs</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Premium plan</div></div></div><span className="tag tag-amber">Setup needed</span></div><div className="cb"><div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>AI responds to story replies and DMs. Connects via Meta Graph API.</div><button className="btn btn-dark btn-sm">Connect Instagram</button></div></div>

          <div className="card"><div className="ch"><div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><div style={{ width: '34px', height: '34px', background: '#0866ff', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👥</div><div><div className="ct">Facebook Groups</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Premium plan</div></div></div><span className="tag tag-green">Active</span></div><div className="cb"><div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>AI monitoring 3 groups. Comments + DMs on relevant posts.</div><button className="btn btn-ghost btn-sm">Manage groups</button></div></div>

          <div className="card"><div className="ch"><div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><div style={{ width: '34px', height: '34px', background: '#0052cc', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📅</div><div><div className="ct">Cal.com (Booking)</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Pro plan · Free tier available</div></div></div><span className="tag tag-green">Connected</span></div><div className="cb"><div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>AI sends booking link when lead is ready. Free alternative to Calendly.</div><button className="btn btn-ghost btn-sm">Configure</button></div></div>

          <div className="card"><div className="ch"><div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><div style={{ width: '34px', height: '34px', background: '#635bff', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💳</div><div><div className="ct">Stripe (Payments)</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>All plans · 2.9% + $0.30/transaction</div></div></div><span className="tag tag-amber">Setup needed</span></div><div className="cb"><div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>AI can send a deposit link when booking is confirmed. Collect $25–$50 holds.</div><button className="btn btn-dark btn-sm">Connect Stripe</button></div></div>

          <div className="card"><div className="ch"><div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><div style={{ width: '34px', height: '34px', background: '#4285f4', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📢</div><div><div className="ct">Google Ads</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Pro plan</div></div></div><span className="tag tag-gray">Not connected</span></div><div className="cb"><div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '10px' }}>Lead form extensions → AI response in seconds. Connect via Google API.</div><button className="btn btn-ghost btn-sm">Connect Google Ads</button></div></div>

          <div className="card"><div className="ch"><div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><div style={{ width: '34px', height: '34px', background: '#ff7a59', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚡</div><div><div className="ct">Webhook (Universal)</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>All plans</div></div></div><span className="tag tag-green">Active</span></div><div className="cb"><div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '7px' }}>Any tool that supports webhooks can trigger your AI agent.</div><div style={{ background: 'var(--surface2)', borderRadius: 'var(--r)', padding: '6px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--text2)', wordBreak: 'break-all', marginBottom: '8px' }}>https://app.leadclaw.io/webhook/abc123</div><button className="btn btn-ghost btn-sm" onClick={copyWebhook}>Copy URL</button></div></div>

        </div>
      </div>
    </div>
  );
}
