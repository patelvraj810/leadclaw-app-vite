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
    <div className="page active" id="p-dash">
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
            <button className="fbtn" onClick={() => navigate('/app/leads')}>View all</button>
          </CardHeader>
          <CardBody>
            {leads.map((l, i) => (
              <div className="lead-row" key={l.id}>
                <div className="lav" style={{ background: i === 0 ? 'var(--purple)' : i === 1 ? 'var(--blue)' : i === 2 ? 'var(--green)' : 'var(--red)' }}>
                  {l.av}
                </div>
                <div className="li">
                  <div className="ln">{l.name}</div>
                  <div className="ld">{l.source}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`mode-pill mode-${l.mode.toLowerCase()}`} style={{ marginBottom: '3px' }}>{l.mode}</div>
                  <div className="ld">{l.time}</div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent conversations</CardTitle>
            <button className="fbtn" onClick={() => navigate('/app/conversations')}>View all</button>
          </CardHeader>
          <CardBody>
            {leads.slice(0, 3).map(l => (
              <div className="lead-row" style={{ alignItems: 'flex-start' }} key={l.id}>
                <div className="li">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div className="ln" style={{ fontWeight: l.id === 'sarah' ? '600' : 'normal' }}>{l.name}</div>
                    <div className="ld">{l.time.replace(' ago', '')}</div>
                  </div>
                  <div className="ld" style={{ fontWeight: l.id === 'sarah' ? '500' : 'normal', color: l.id === 'sarah' ? 'var(--text)' : 'inherit' }}>
                    {l.preview}
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card style={{ marginTop: '18px', borderColor: 'var(--text)' }}>
        <div className="ch" style={{ background: 'var(--text)' }}>
          <CardTitle style={{ color: '#fff' }}>🚀 Finish your setup — 2 steps left</CardTitle>
          <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,.15)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: '#fff', borderRadius: '3px' }}></div>
          </div>
        </div>
        <CardBody>
          <div className="checklist-row">
            <div className="cl-check cl-done">✓</div>
            <div className="cl-info">
              <div className="cl-title done">Create your account</div>
            </div>
            <Tag color="green">Done</Tag>
          </div>
          <div className="checklist-row">
            <div className="cl-check cl-done">✓</div>
            <div className="cl-info">
              <div className="cl-title done">Tell us about your business</div>
            </div>
            <Tag color="green">Done</Tag>
          </div>
          <div className="checklist-row">
            <div className="cl-check cl-done">✓</div>
            <div className="cl-info">
              <div className="cl-title done">Set up your AI agent</div>
            </div>
            <Tag color="green">Done</Tag>
          </div>
          <div className="checklist-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/integrations')}>
            <div className="cl-check cl-todo">4</div>
            <div className="cl-info">
              <div className="cl-title">Connect your lead source</div>
              <div className="cl-sub">Add your webhook URL to your contact form</div>
            </div>
            <button className="fbtn">Connect →</button>
          </div>
          <div className="checklist-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/integrations')}>
            <div className="cl-check cl-todo">5</div>
            <div className="cl-info">
              <div className="cl-title">Connect WhatsApp (optional)</div>
              <div className="cl-sub">Reach leads where they already are</div>
            </div>
            <button className="fbtn">Connect →</button>
          </div>
        </CardBody>
      </Card>

      <Card style={{ marginTop: '18px' }}>
        <CardHeader>
          <CardTitle>AI agent activity</CardTitle>
          <Tag color="green">Active now</Tag>
        </CardHeader>
        <CardBody>
          <div className="act-row">
            <div className="act-dot" style={{ background: 'var(--green)' }}></div>
            <div className="cl-info">
              <div className="cl-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Invoice sent to Sarah Rodriguez <span className="mode-pill mode-closer">Closer</span></div>
              <div className="cl-sub">$89 diagnostic deposit · Today 2–5 PM · 2 minutes ago</div>
            </div>
          </div>
          <div className="act-row">
            <div className="act-dot" style={{ background: 'var(--amber)' }}></div>
            <div className="cl-info">
              <div className="cl-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Hunting in Brampton Homeowners <span className="mode-pill mode-hunter">Hunter</span></div>
              <div className="cl-sub">Replied to James Thompson's post · 18 minutes ago</div>
            </div>
          </div>
          <div className="act-row">
            <div className="act-dot" style={{ background: 'var(--green)' }}></div>
            <div className="cl-info">
              <div className="cl-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Qualifying Aisha Patel <span className="mode-pill mode-qualifier">Qualifier</span></div>
              <div className="cl-sub">Asking about bedrooms/bathrooms · 1 hour ago</div>
            </div>
          </div>
          <div className="act-row">
            <div className="act-dot" style={{ background: 'var(--text3)' }}></div>
            <div className="cl-info">
              <div className="cl-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Follow-up scheduled — Marcus Kim <span className="mode-pill mode-nurturer">Nurturer</span></div>
              <div className="cl-sub">No response to sink leak · Auto follow-up in 20h · 3 hours ago</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
