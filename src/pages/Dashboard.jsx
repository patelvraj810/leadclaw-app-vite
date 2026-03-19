import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';
import { convData } from '../data/conversations';

export function Dashboard() {
  const navigate = useNavigate();
  const leads = Object.values(convData).slice(0, 4);

  return (
    <div className="page-content active">
      <div className="kpi-grid">
        <KpiCard label="Leads today" value="12" change="↑ 4 more than yesterday" />
        <KpiCard label="Qualified" value="8" change="66% qual rate" />
        <KpiCard label="Avg response" value="12s" change="Industry avg: 4 hrs" />
        <KpiCard label="This month" value="134" change="↑ 24% vs last month" />
      </div>

      <div className="dash-grid">
        <Card>
          <CardHeader>
            <CardTitle>New leads</CardTitle>
            <Button variant="ghost" style={{ padding: '5px 12px', fontSize: '12px' }} onClick={() => navigate('/app/leads')}>
              View all
            </Button>
          </CardHeader>
          <CardBody>
            {leads.map((l, i) => (
              <div className="lead-item" key={l.id}>
                <div className="lead-av" style={{ background: i === 0 ? '#7c3aed' : i === 1 ? '#2563eb' : i === 2 ? '#16a34a' : '#dc2626' }}>
                  {l.av}
                </div>
                <div className="lead-info">
                  <div className="lead-name">{l.name}</div>
                  <div className="lead-detail">{l.source}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`mode-pill mode-${l.mode.toLowerCase()}`} style={{ marginBottom: '3px', display: 'inline-block' }}>{l.mode}</div>
                  <div className="lead-time">{l.time}</div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent conversations</CardTitle>
            <Button variant="ghost" style={{ padding: '5px 12px', fontSize: '12px' }} onClick={() => navigate('/app/conversations')}>
              View all
            </Button>
          </CardHeader>
          <CardBody>
            {leads.slice(0, 3).map(l => (
              <div className="conv-item" key={l.id}>
                <div className="conv-top">
                  <div className="conv-name" style={{ fontWeight: l.id === 'sarah' ? '600' : 'normal' }}>{l.name}</div>
                  <div className="conv-time">{l.time.replace(' ago', '')}</div>
                </div>
                <div className="conv-preview" style={{ fontWeight: l.id === 'sarah' ? '500' : 'normal', color: l.id === 'sarah' ? 'var(--text)' : 'inherit' }}>
                  {l.preview}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card style={{ marginTop: '18px', borderColor: 'var(--text)' }}>
        <div className="card-header" style={{ background: 'var(--text)' }}>
          <CardTitle style={{ color: '#fff' }}>🚀 Finish your setup — 2 steps left</CardTitle>
          <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,.15)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: '#fff', borderRadius: '3px' }}></div>
          </div>
        </div>
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', flexShrink: '0', fontWeight: '700' }}>✓</div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', textDecoration: 'line-through', color: 'var(--text3)' }}>Create your account</div>
              </div>
              <Tag color="green">Done</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', flexShrink: '0', fontWeight: '700' }}>✓</div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', textDecoration: 'line-through', color: 'var(--text3)' }}>Tell us about your business</div>
              </div>
              <Tag color="green">Done</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', flexShrink: '0', fontWeight: '700' }}>✓</div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', textDecoration: 'line-through', color: 'var(--text3)' }}>Set up your AI agent</div>
              </div>
              <Tag color="green">Done</Tag>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => navigate('/app/integrations')}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--text3)', flexShrink: '0' }}>4</div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>Connect your lead source</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Add your webhook URL to your contact form</div>
              </div>
              <Button variant="ghost" style={{ padding: '5px 12px', fontSize: '12px' }}>Connect →</Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', cursor: 'pointer' }} onClick={() => navigate('/app/integrations')}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--text3)', flexShrink: '0' }}>5</div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>Connect WhatsApp (optional)</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Reach leads where they already are</div>
              </div>
              <Button variant="ghost" style={{ padding: '5px 12px', fontSize: '12px' }}>Connect →</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card style={{ marginTop: '18px' }}>
        <CardHeader>
          <CardTitle>AI agent activity</CardTitle>
          <Tag color="green">Active now</Tag>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="activity-dot" style={{ background: 'var(--green)' }}></div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>Invoice sent to Sarah Rodriguez <span className="mode-pill mode-closer">Closer</span></div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>$89 diagnostic deposit · Today 2–5 PM · 2 minutes ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="activity-dot" style={{ background: 'var(--amber)' }}></div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>Hunting in Brampton Homeowners <span className="mode-pill mode-hunter">Hunter</span></div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Replied to James Thompson's post · 18 minutes ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="activity-dot" style={{ background: 'var(--green)' }}></div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>Qualifying Aisha Patel <span className="mode-pill mode-qualifier">Qualifier</span></div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Asking about bedrooms/bathrooms · 1 hour ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '13px', alignItems: 'flex-start', padding: '9px 0' }}>
              <div className="activity-dot" style={{ background: 'var(--text3)' }}></div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>Follow-up scheduled — Marcus Kim <span className="mode-pill mode-nurturer">Nurturer</span></div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>No response to sink leak · Auto follow-up in 20h · 3 hours ago</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
