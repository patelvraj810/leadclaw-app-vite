import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';

export function Campaigns() {
  return (
    <div className="page-content active" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        
        <Card>
          <CardHeader>
            <CardTitle>🌱 Cold Lead Re-engagement</CardTitle>
            <Tag color="green">Active</Tag>
          </CardHeader>
          <CardBody>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>
              Auto follow-up for leads who didn't respond. Day 1, 3, 7, 14 — different angle each time.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '7px 10px', background: 'var(--green-bg)', borderRadius: 'var(--r)' }}>
                <span>Day 1 — "Did my message come through?"</span>
                <Tag color="green" style={{ fontSize: '10px', padding: '1px 6px' }}>Sent 12</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '7px 10px', background: 'var(--surface2)', borderRadius: 'var(--r)' }}>
                <span>Day 3 — Seasonal tip + soft pitch</span>
                <Tag color="gray" style={{ fontSize: '10px', padding: '1px 6px' }}>Queued 5</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '7px 10px', background: 'var(--surface2)', borderRadius: 'var(--r)' }}>
                <span>Day 7 — Customer story re-engage</span>
                <Tag color="gray" style={{ fontSize: '10px', padding: '1px 6px' }}>Queued 3</Tag>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Edit sequence</Button>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>View stats</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎣 Facebook Group Hunter</CardTitle>
            <Tag color="green">Running</Tag>
          </CardHeader>
          <CardBody>
             <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>
              AI monitors 3 Facebook groups every 2 hours, comments on relevant posts, then DMs engaged users.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '7px 10px', background: 'var(--surface2)', borderRadius: 'var(--r)' }}>
                <span>Brampton Homeowners</span>
                <span style={{ fontSize: '11px', color: 'var(--green)' }}>7 leads this month</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '7px 10px', background: 'var(--surface2)', borderRadius: 'var(--r)' }}>
                <span>Mississauga Home Services</span>
                <span style={{ fontSize: '11px', color: 'var(--green)' }}>6 leads this month</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '7px 10px', background: 'var(--surface2)', borderRadius: 'var(--r)' }}>
                <span>Toronto HVAC & Plumbing Help</span>
                <span style={{ fontSize: '11px', color: 'var(--green)' }}>5 leads this month</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>+ Add group</Button>
              <Button variant="ghost" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Edit settings</Button>
            </div>
          </CardBody>
        </Card>

        <div 
          onClick={() => alert('Create a Google Ads campaign — connect your account first')}
          style={{ cursor: 'pointer', border: '1.5px dashed var(--border2)', borderRadius: 'var(--rl)', background: 'transparent' }}
        >
          <div style={{ textAlign: 'center', padding: '32px 18px' }}>
             <div style={{ fontSize: '28px', marginBottom: '10px' }}>📢</div>
             <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>Google Ads Campaign</div>
             <div style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '14px' }}>Connect your Google Ads account and let AI manage the full funnel — ad to booking.</div>
             <Button variant="dark" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Set up →</Button>
          </div>
        </div>

        <div 
          onClick={() => alert('Create a Facebook Ads campaign — connect your Meta account first')}
          style={{ cursor: 'pointer', border: '1.5px dashed var(--border2)', borderRadius: 'var(--rl)', background: 'transparent' }}
        >
          <div style={{ textAlign: 'center', padding: '32px 18px' }}>
             <div style={{ fontSize: '28px', marginBottom: '10px' }}>📘</div>
             <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>Facebook Ads Campaign</div>
             <div style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '14px' }}>Lead form ads → AI response in seconds. Connect Meta Business and go live today.</div>
             <Button variant="dark" size="sm" style={{ padding: '6px 14px', fontSize: '12px' }}>Set up →</Button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
