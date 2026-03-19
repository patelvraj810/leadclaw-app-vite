import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';

export function Sources() {
  const srcClick = (name) => {
    alert(`Configuring: ${name}\nIn the real app this opens the connection flow for this lead source.`);
  };

  return (
    <div className="page-content active sources-page" style={{ padding: '22px 24px' }}>
      <div className="src-cat" style={{ marginBottom: '28px' }}>
        <div className="src-cat-title" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🟢 Inbound — Passive capture <Tag color="green">Responds to leads who find you</Tag>
        </div>
        <div className="src-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div className="src-card connected" onClick={() => srcClick('Website Form')} style={{ background: 'var(--green-bg)', borderColor: 'var(--green-b)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌐</div>
              <Tag color="green">Connected</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>Website Form</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>Webhook URL active. Every form submission triggers AI response in &lt;60s.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>47 leads this month</span>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Configure</Button>
            </div>
          </div>
          
          <div className="src-card connected" onClick={() => srcClick('Google Ads')} style={{ background: 'var(--green-bg)', borderColor: 'var(--green-b)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📢</div>
              <Tag color="green">Connected</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>Google Ads</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>Google Ads account linked. Lead form extensions feed directly to AI.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>15 leads this month</span>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Configure</Button>
            </div>
          </div>
          
          <div className="src-card" onClick={() => srcClick('Facebook Ads')} style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📘</div>
              <Tag color="amber">Not connected</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>Facebook Ads</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>Connect Meta Business account. Lead form ads → AI response in seconds.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Pro plan</span>
              <Button variant="dark" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Connect</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="src-cat" style={{ marginBottom: '28px' }}>
        <div className="src-cat-title" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🟣 Outbound — AI actively hunts <Tag color="purple">Premium · AI finds leads for you</Tag>
        </div>
        <div className="src-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div className="src-card connected" onClick={() => srcClick('Facebook Groups')} style={{ background: 'var(--green-bg)', borderColor: 'var(--green-b)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👥</div>
              <Tag color="green">Active</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>Facebook Groups</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>Monitoring 3 groups. AI posts helpful comments, then DMs interested people.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>18 leads this month</span>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Manage groups</Button>
            </div>
          </div>
          
          <div className="src-card" onClick={() => srcClick('Instagram DMs')} style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📸</div>
              <Tag color="amber">Not connected</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>Instagram DMs</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>AI responds to story replies and DMs. Qualify leads without touching your phone.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Premium plan</span>
              <Button variant="dark" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Connect</Button>
            </div>
          </div>
          
          <div className="src-card" onClick={() => srcClick('Google Maps')} style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⭐</div>
              <Tag color="amber">Not connected</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>Google Maps Alerts</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>Monitor competitor reviews. People leaving 1-star reviews for slow response are your leads.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Pro+ plan</span>
              <Button variant="dark" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Activate</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="src-cat">
        <div className="src-cat-title" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🟡 Directory & Marketplaces <Tag color="amber">Leads sent to you by LeadClaw</Tag>
        </div>
        <div className="src-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div className="src-card connected" style={{ background: 'var(--green-bg)', borderColor: 'var(--green-b)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏠</div>
              <Tag color="green">Listed</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>LeadClaw Directory</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>Listed on leadclaw.io/find. Homeowners search, your AI agent responds instantly.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>3 leads this month</span>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>View listing</Button>
            </div>
          </div>
          
          <div className="src-card" style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏗</div>
              <Tag color="gray">Coming soon</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>Angi / HomeStars</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>Auto-respond to quote requests before competitors see them.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Premium plan</span>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }} disabled>Notify me</Button>
            </div>
          </div>
          
          <div className="src-card" style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--rl)', padding: '16px', cursor: 'pointer', borderStyle: 'solid', borderWidth: '1px' }}>
             <div className="src-card-top" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="src-card-icon" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📋</div>
              <Tag color="green">All plans</Tag>
            </div>
            <div className="src-card-name" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '3px' }}>Manual Import</div>
            <div className="src-card-desc" style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5' }}>Upload CSV or paste a contact list. AI starts working every contact immediately.</div>
            <div className="src-card-foot" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Upload any time</span>
              <Button variant="dark" size="sm" onClick={() => alert('Upload a CSV with name, email, phone, service — AI starts working instantly')} style={{ padding: '6px 14px', fontSize: '12px' }}>Import</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
