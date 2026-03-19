import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';

export function Sources() {
  const srcClick = (name) => {
    alert(`Configuring: ${name}\nIn the real app this opens the connection flow for this lead source.`);
  };

  return (
    <div className="page active" id="p-sources">
      <div className="topbar">
        <div>
          <div className="tb-title">Lead Sources</div>
          <div className="tb-sub">Choose where your leads come from</div>
        </div>
      </div>
      <div className="src-cat">
        <div className="src-cat-title">
          🟢 Inbound — Passive capture <Tag color="green">Responds to leads who find you</Tag>
        </div>
        <div className="src-cards">
          <div className="src-card connected" onClick={() => srcClick('Website Form')}>
            <div className="src-card-top">
              <div className="src-card-icon">🌐</div>
              <Tag color="green">Connected</Tag>
            </div>
            <div className="src-card-name">Website Form</div>
            <div className="src-card-desc">Webhook URL active. Every form submission triggers AI response in &lt;60s.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>47 leads this month</span>
              <button className="fbtn" style={{ padding: '6px 14px' }}>Configure</button>
            </div>
          </div>
          
          <div className="src-card connected" onClick={() => srcClick('Google Ads')}>
            <div className="src-card-top">
              <div className="src-card-icon">📢</div>
              <Tag color="green">Connected</Tag>
            </div>
            <div className="src-card-name">Google Ads</div>
            <div className="src-card-desc">Google Ads account linked. Lead form extensions feed directly to AI.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>15 leads this month</span>
              <button className="fbtn" style={{ padding: '6px 14px' }}>Configure</button>
            </div>
          </div>
          
          <div className="src-card" onClick={() => srcClick('Facebook Ads')}>
            <div className="src-card-top">
              <div className="src-card-icon">📘</div>
              <Tag color="amber">Not connected</Tag>
            </div>
            <div className="src-card-name">Facebook Ads</div>
            <div className="src-card-desc">Connect Meta Business account. Lead form ads → AI response in seconds.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Pro plan</span>
              <button className="btn btn-dark btn-sm">Connect</button>
            </div>
          </div>
        </div>
      </div>

      <div className="src-cat">
        <div className="src-cat-title">
          🟣 Outbound — AI actively hunts <Tag color="purple">Premium · AI finds leads for you</Tag>
        </div>
        <div className="src-cards">
          <div className="src-card connected" onClick={() => srcClick('Facebook Groups')}>
            <div className="src-card-top">
              <div className="src-card-icon">👥</div>
              <Tag color="green">Active</Tag>
            </div>
            <div className="src-card-name">Facebook Groups</div>
            <div className="src-card-desc">Monitoring 3 groups. AI posts helpful comments, then DMs interested people.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>18 leads this month</span>
              <button className="fbtn" style={{ padding: '6px 14px' }}>Manage groups</button>
            </div>
          </div>
          
          <div className="src-card" onClick={() => srcClick('Instagram DMs')}>
            <div className="src-card-top">
              <div className="src-card-icon">📸</div>
              <Tag color="amber">Not connected</Tag>
            </div>
            <div className="src-card-name">Instagram DMs</div>
            <div className="src-card-desc">AI responds to story replies and DMs. Qualify leads without touching your phone.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Premium plan</span>
              <button className="btn btn-dark btn-sm">Connect</button>
            </div>
          </div>
          
          <div className="src-card" onClick={() => srcClick('Google Maps')}>
            <div className="src-card-top">
              <div className="src-card-icon">⭐</div>
              <Tag color="amber">Not connected</Tag>
            </div>
            <div className="src-card-name">Google Maps Alerts</div>
            <div className="src-card-desc">Monitor competitor reviews. People leaving 1-star reviews for slow response are your leads.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Pro+ plan</span>
              <button className="btn btn-dark btn-sm">Activate</button>
            </div>
          </div>
        </div>
      </div>

      <div className="src-cat">
        <div className="src-cat-title">
          🟡 Directory & Marketplaces <Tag color="amber">Leads sent to you by LeadClaw</Tag>
        </div>
        <div className="src-cards">
          <div className="src-card connected">
            <div className="src-card-top">
              <div className="src-card-icon">🏠</div>
              <Tag color="green">Listed</Tag>
            </div>
            <div className="src-card-name">LeadClaw Directory</div>
            <div className="src-card-desc">Listed on leadclaw.io/find. Homeowners search, your AI agent responds instantly.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>3 leads this month</span>
              <button className="fbtn" style={{ padding: '6px 14px' }}>View listing</button>
            </div>
          </div>
          
          <div className="src-card">
            <div className="src-card-top">
              <div className="src-card-icon">🏗</div>
              <Tag color="gray">Coming soon</Tag>
            </div>
            <div className="src-card-name">Angi / HomeStars</div>
            <div className="src-card-desc">Auto-respond to quote requests before competitors see them.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Premium plan</span>
              <button className="fbtn" style={{ padding: '6px 14px' }} disabled>Notify me</button>
            </div>
          </div>
          
          <div className="src-card">
             <div className="src-card-top">
              <div className="src-card-icon">📋</div>
              <Tag color="green">All plans</Tag>
            </div>
            <div className="src-card-name">Manual Import</div>
            <div className="src-card-desc">Upload CSV or paste a contact list. AI starts working every contact immediately.</div>
            <div className="src-card-foot">
              <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Upload any time</span>
              <button className="btn btn-dark btn-sm" onClick={() => alert('Upload a CSV with name, email, phone, service — AI starts working instantly')}>Import</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
