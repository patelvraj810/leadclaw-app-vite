import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import { Tag } from '../components/ui/Tag';
import { convData } from '../data/conversations';

export function Dashboard() {
  const navigate = useNavigate();
  // Match V2 lead order
  const leads = [
    convData.sarah,
    convData.james,
    convData.aisha,
    convData.marcus
  ].filter(Boolean);

  return (
    <div className="page active" id="p-dash">
      <div className="topbar">
        <div>
          <div className="tb-title">Dashboard</div>
          <div className="tb-sub" id="dash-greet">Good morning — AI agent is active across 3 channels</div>
        </div>
        <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
          <span className="tag tag-green" style={{ fontSize: '12px', padding: '5px 11px' }}>
            <span style={{ width: '5px', height: '5px', background: 'var(--green)', borderRadius: '50%', display: 'inline-block', marginRight: '3px' }}></span>
            Agent Online
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Site</button>
        </div>
      </div>

      <div style={{ padding: '22px 24px' }}>
        <div className="kpi-grid">
          <KpiCard label="Leads today" value="7" change="↑ 3 more than yesterday" />
          <KpiCard label="Qualified" value="5" change="71% qual rate" />
          <KpiCard label="Avg response" value="34s" change="Industry avg: 4 hrs" />
          <KpiCard label="This month" value="64" change="↑ 34% vs last month" />
        </div>

        {/* Setup Checklist */}
        <Card style={{ marginBottom: '18px', borderColor: 'var(--text)' }}>
          <div className="ch" style={{ background: 'var(--text)' }}>
            <div className="ct" style={{ color: '#fff' }}>🚀 Finish your setup — 2 steps left</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '100px', height: '5px', background: 'rgba(255,255,255,.2)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', background: '#fff', borderRadius: '3px' }}></div>
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)' }}>3/5</span>
            </div>
          </div>
          <CardBody>
            <div className="checklist-row">
              <div className="cl-check cl-done">✓</div>
              <div className="cl-info">
                <div className="cl-title done">Create account</div>
              </div>
              <Tag color="green" style={{ fontSize: '11px' }}>Done</Tag>
            </div>
            <div className="checklist-row">
              <div className="cl-check cl-done">✓</div>
              <div className="cl-info">
                <div className="cl-title done">Business profile</div>
              </div>
              <Tag color="green" style={{ fontSize: '11px' }}>Done</Tag>
            </div>
            <div className="checklist-row">
              <div className="cl-check cl-done">✓</div>
              <div className="cl-info">
                <div className="cl-title done">Email channel connected</div>
              </div>
              <Tag color="green" style={{ fontSize: '11px' }}>Done</Tag>
            </div>
            <div className="checklist-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/agent')}>
              <div className="cl-check cl-todo">4</div>
              <div className="cl-info">
                <div className="cl-title">Set up your AI agent personality</div>
                <div className="cl-sub">Give it a name, tone and opening message</div>
              </div>
              <button className="btn btn-dark btn-sm">Set up →</button>
            </div>
            <div className="checklist-row" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/sources')}>
              <div className="cl-check cl-todo">5</div>
              <div className="cl-info">
                <div className="cl-title">Connect your first lead source</div>
                <div className="cl-sub">Website form, Google Ads, Facebook — your choice</div>
              </div>
              <button className="btn btn-ghost btn-sm">Connect →</button>
            </div>
          </CardBody>
        </Card>

        <div className="dash-grid">
          <Card>
            <CardHeader>
              <CardTitle>New leads</CardTitle>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/leads')}>View all</button>
            </CardHeader>
            <CardBody>
              {leads.map((l, i) => (
                <div className="lead-row" key={l.id}>
                  <div className="lav" style={{ background: i === 0 ? 'var(--purple)' : i === 1 ? 'var(--blue)' : i === 2 ? 'var(--green)' : 'var(--red)' }}>
                    {l.av}
                  </div>
                  <div className="li">
                    <div className="ln">{l.name}</div>
                    <div className="ld">{l.sub.split(' · ')[0]} · via {l.source}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Tag color={l.tagCls.replace('tag-', '')} style={{ fontSize: '10px' }}>{l.tag}</Tag>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px', fontFamily: "'JetBrains Mono', monospace" }}>{l.time.includes('ago') ? l.time : `${l.time} ago`}</div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent activity</CardTitle>
              <Tag color="green" style={{ fontSize: '11px' }}>Live</Tag>
            </CardHeader>
            <CardBody>
              <div className="act-row">
                <div className="act-dot" style={{ background: 'var(--green)' }}></div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>Booking confirmed — Sarah Rodriguez</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                    HVAC emergency · Today 2–5 PM · <span className="mode-pill mode-closer" style={{ fontSize: '9px', padding: '1px 6px' }}>Closer</span>
                  </div>
                </div>
              </div>
              <div className="act-row">
                <div className="act-dot" style={{ background: 'var(--amber)' }}></div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>Qualifying James Thompson</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                    Real estate buyer · In convo · <span className="mode-pill mode-qualifier" style={{ fontSize: '9px', padding: '1px 6px' }}>Qualifier</span>
                  </div>
                </div>
              </div>
              <div className="act-row">
                <div className="act-dot" style={{ background: 'var(--purple)' }}></div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>Hunting — Brampton Homeowners Group</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                    Found 3 AC posts · Commented on 2 · <span className="mode-pill mode-hunter" style={{ fontSize: '9px', padding: '1px 6px' }}>Hunter</span>
                  </div>
                </div>
              </div>
              <div className="act-row">
                <div className="act-dot" style={{ background: 'var(--text3)' }}></div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>Follow-up queued — Marcus Kim</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                    Day 3 re-engagement · 20h · <span className="mode-pill mode-nurturer" style={{ fontSize: '9px', padding: '1px 6px' }}>Nurturer</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
