import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';

export function Integrations() {
  const copyWebhook = () => {
    navigator.clipboard.writeText('https://app.leadclaw.io/webhook/abc123')
      .then(() => alert('Copied!'));
  };

  return (
    <div className="page-content active">
      <div className="int-grid">
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="int-icon" style={{ background: '#ea4335', color: '#fff' }}>✉</div>
              <div>
                <CardTitle>Email</CardTitle>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>All plans</div>
              </div>
            </div>
            <Tag color="green">Connected</Tag>
          </CardHeader>
          <CardBody>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>
              AI responds to leads via email from your business address.
            </div>
            <Button variant="ghost">Configure</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="int-icon" style={{ background: '#25d366', color: '#fff' }}>📱</div>
              <div>
                <CardTitle>WhatsApp</CardTitle>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Pro plan</div>
              </div>
            </div>
            <Tag color="amber">Setup needed</Tag>
          </CardHeader>
          <CardBody>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>
              Connect via Meta Cloud API (free) or Twilio. AI responds to WhatsApp messages instantly.
            </div>
            <Button>Connect WhatsApp</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="int-icon" style={{ background: '#5865f2', color: '#fff' }}>📞</div>
              <div>
                <CardTitle>AI Voice Calls</CardTitle>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Premium plan</div>
              </div>
            </div>
            <Tag color="gray">Upgrade needed</Tag>
          </CardHeader>
          <CardBody>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>
              AI calls leads within 60 seconds. Powered by Vapi.ai.
            </div>
            <Button variant="ghost" onClick={() => alert('Upgrade to Premium to unlock AI Voice Calls')}>Upgrade</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="int-icon" style={{ background: '#ff7a59', color: '#fff' }}>⚡</div>
              <div>
                <CardTitle>Lead Webhook</CardTitle>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>All plans</div>
              </div>
            </div>
            <Tag color="green">Active</Tag>
          </CardHeader>
          <CardBody>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '8px' }}>
              Any form triggers your AI agent. Paste this URL into Typeform, Jotform, or your site.
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 'var(--r)', padding: '7px 11px', fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--text2)', wordBreak: 'break-all', marginBottom: '8px' }}>
              https://app.leadclaw.io/webhook/abc123
            </div>
            <Button variant="ghost" onClick={copyWebhook}>Copy URL</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="int-icon" style={{ background: '#0052cc', color: '#fff' }}>📅</div>
              <div>
                <CardTitle>Calendly</CardTitle>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Pro plan</div>
              </div>
            </div>
            <Tag color="gray">Not connected</Tag>
          </CardHeader>
          <CardBody>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>
              AI sends your booking link when a lead is ready to schedule.
            </div>
            <Button variant="ghost">Connect calendar</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="int-icon" style={{ background: '#404040', color: '#fff' }}>🔔</div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>All plans</div>
              </div>
            </div>
            <Tag color="green">Active</Tag>
          </CardHeader>
          <CardBody>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>
              Get notified when a lead qualifies or needs your attention.
            </div>
            <Button variant="ghost">Configure</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
