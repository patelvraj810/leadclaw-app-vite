import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../components/ui/Tag';
import { fetchStats, fetchLeads } from '../lib/api';

function formatTimeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const STATUS_MAP = {
  qualified:    { label: 'Qualified',   color: 'green'  },
  in_progress:  { label: 'In Progress', color: 'blue'   },
  pending:      { label: 'New',         color: 'purple' },
  disqualified: { label: 'Lost',        color: 'red'    },
};

const AVATAR_COLORS = ['var(--purple)', 'var(--blue)', 'var(--green)', 'var(--amber)', 'var(--red)'];

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats]   = useState(null);
  const [leads, setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [focus, setFocus]   = useState('all');
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  useEffect(() => {
    Promise.all([fetchStats(), fetchLeads()])
      .then(([s, l]) => { setStats(s); setLeads(Array.isArray(l) ? l : []); })
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const checklist = useMemo(() => [
    { label: 'Create account',               done: true },
    { label: 'Business profile',             done: true },
    { label: 'Email channel connected',      done: true },
    { label: 'Set up AI agent personality',  done: !!stats?.agentConfigured, route: '/app/agent',   cta: 'Set up →',  ctaClass: 'btn-dark' },
    { label: 'Connect first lead source',    done: !!(stats?.totalConversations > 0 || leads.length > 0), route: '/app/sources', cta: 'Connect →', ctaClass: 'btn-ghost' },
  ], [stats, leads]);

  const doneCount  = checklist.filter(i => i.done).length;
  const allDone    = doneCount === checklist.length;
  const progressPct = Math.round((doneCount / checklist.length) * 100);

  const buckets = useMemo(() => ({
    total:     leads.length,
    fresh:     leads.filter(l => !l.qualification_status || l.qualification_status === 'pending').length,
    qualified: leads.filter(l => l.qualification_status === 'qualified').length,
    active:    leads.filter(l => l.qualification_status === 'in_progress').length,
  }), [leads]);

  const focusTabs = [
    { key: 'all',       label: 'All leads',   count: buckets.total },
    { key: 'fresh',     label: 'New',         count: buckets.fresh },
    { key: 'qualified', label: 'Qualified',   count: buckets.qualified },
    { key: 'active',    label: 'In progress', count: buckets.active },
  ];

  const filteredLeads = useMemo(() => {
    if (focus === 'fresh')     return leads.filter(l => !l.qualification_status || l.qualification_status === 'pending');
    if (focus === 'qualified') return leads.filter(l => l.qualification_status === 'qualified');
    if (focus === 'active')    return leads.filter(l => l.qualification_status === 'in_progress');
    return leads;
  }, [focus, leads]);

  useEffect(() => {
    if (!filteredLeads.length) { setSelectedLeadId(null); return; }
    if (!filteredLeads.some(l => l.id === selectedLeadId)) setSelectedLeadId(filteredLeads[0].id);
  }, [filteredLeads, selectedLeadId]);

  const selectedLead = filteredLeads.find(l => l.id === selectedLeadId) || filteredLeads[0] || null;
  const selectedStatus = STATUS_MAP[selectedLead?.qualification_status] || { label: 'New', color: 'purple' };

  const kpis = [
    { label: 'Leads today',   value: stats?.leadsToday   ?? '—', sub: stats?.leadsTodayChange   ?? '↑ 3 more than yesterday' },
    { label: 'Qualified',     value: stats?.qualified     ?? '—', sub: stats?.qualifiedChange     ?? '71% qualification rate' },
    { label: 'Avg response',  value: stats?.avgResponse   ?? '< 60s', sub: 'Industry avg: 4 hrs' },
    { label: 'This month',    value: stats?.thisMonth     ?? '—', sub: stats?.thisMonthChange     ?? '↑ 34% vs last month' },
  ];

  if (loading) return <div className="page"><div className="loading">Loading your dashboard…</div></div>;

  return (
    <div className="page active dashboard-page surface-page">

      {/* HERO */}
      <section className="dash-hero">
        <div className="dash-hero-copy">
          <div className="dash-hero-eyebrow">Live revenue engine</div>
          <h2 className="dash-hero-title">
            Your AI agent is actively converting demand into booked conversations.
          </h2>
          <p className="dash-hero-sub">
            Track live lead flow, agent actions, and conversion momentum — without digging through disconnected tools.
          </p>
          <div className="dash-hero-actions">
            <button className="btn btn-dark" onClick={() => navigate('/app/conversations')}>Open live inbox</button>
            <button className="btn btn-ghost" onClick={() => navigate('/app/analytics')}>View analytics</button>
          </div>
        </div>
        <div className="dash-hero-rail">
          <div className="dash-hero-stat">
            <span className="dash-hero-stat-label">Response speed</span>
            <strong>&lt; 60s</strong>
          </div>
          <div className="dash-hero-stat">
            <span className="dash-hero-stat-label">Qualified today</span>
            <strong>{stats?.qualified ?? '—'}</strong>
          </div>
          <div className="dash-hero-stat">
            <span className="dash-hero-stat-label">Booked this week</span>
            <strong>{stats?.bookedThisWeek ?? '—'}</strong>
          </div>
        </div>
      </section>

      {/* KPI STRIP */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="kpi">
            <div className="kpi-lbl">{k.label}</div>
            <div className="kpi-val">{k.value}</div>
            <div className="kpi-change">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* COMMAND BAR */}
      <div className="dashboard-command-bar">
        <div className="dashboard-focus-pills">
          {focusTabs.map((tab) => (
            <button
              key={tab.key}
              className={`dashboard-focus-pill${focus === tab.key ? ' active' : ''}`}
              onClick={() => setFocus(tab.key)}
            >
              <span>{tab.label}</span>
              <strong>{tab.count}</strong>
            </button>
          ))}
        </div>
        <div className="dashboard-quick-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/leads')}>Pipeline</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/estimates')}>Estimates</button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/jobs')}>Jobs board</button>
        </div>
      </div>

      {/* SETUP CHECKLIST */}
      {!allDone && (
        <div className="card setup-card">
          <div className="ch setup-card-head">
            <div className="ct setup-card-title">
              Finish setup — {checklist.length - doneCount} step{checklist.length - doneCount !== 1 ? 's' : ''} left
            </div>
            <div className="setup-card-progress">
              <div className="setup-card-progress-track">
                <div className="setup-card-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="setup-card-progress-copy">{doneCount}/{checklist.length}</span>
            </div>
          </div>
          <div className="cb">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className="checklist-row"
                style={item.route && !item.done ? { cursor: 'pointer' } : {}}
                onClick={() => item.route && !item.done && navigate(item.route)}
              >
                <div className={`cl-check ${item.done ? 'cl-done' : 'cl-todo'}`}>
                  {item.done ? '✓' : idx + 1}
                </div>
                <div className="cl-info">
                  <div className={`cl-title${item.done ? ' done' : ''}`}>{item.label}</div>
                </div>
                {item.done
                  ? <Tag color="green" style={{ fontSize: '11px' }}>Done</Tag>
                  : item.cta && <button className={`btn ${item.ctaClass} btn-sm`}>{item.cta}</button>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEAD FLOW + DETAIL */}
      <div className="dash-grid">
        {/* Lead list */}
        <div className="card">
          <div className="ch">
            <div className="ct">
              {focusTabs.find(t => t.key === focus)?.label || 'Lead flow'}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/leads')}>View all</button>
          </div>
          <div className="cb">
            {filteredLeads.slice(0, 6).map((l, i) => {
              const initials = l.contact_name
                ? l.contact_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                : '??';
              const timeAgo = l.created_at ? formatTimeAgo(new Date(l.created_at)) : 'Just now';
              const statusInfo = STATUS_MAP[l.qualification_status] || { label: 'New', color: 'purple' };
              return (
                <button
                  type="button"
                  key={l.id}
                  className={`lead-row dashboard-lead-row${selectedLead?.id === l.id ? ' selected' : ''}`}
                  onClick={() => setSelectedLeadId(l.id)}
                >
                  <div className="lav" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                    {initials}
                  </div>
                  <div className="li">
                    <div className="ln">{l.contact_name || 'Unknown'}</div>
                    <div className="ld">{l.source_detail || l.source || 'web'} · {l.source || 'unknown channel'}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <Tag color={statusInfo.color} style={{ fontSize: '10px' }}>{statusInfo.label}</Tag>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px', fontFamily: "'JetBrains Mono', monospace" }}>{timeAgo}</div>
                  </div>
                </button>
              );
            })}
            {filteredLeads.length === 0 && (
              <div className="dashboard-empty-state">
                No leads match this filter yet.
              </div>
            )}
          </div>
        </div>

        {/* Lead detail */}
        <div className="card activity-card">
          <div className="ch">
            <div className="ct">{selectedLead ? 'Lead command' : 'Agent activity'}</div>
            {selectedLead
              ? <Tag color={selectedStatus.color} style={{ fontSize: '11px' }}>{selectedStatus.label}</Tag>
              : <Tag color="green" style={{ fontSize: '11px' }}>Live</Tag>
            }
          </div>
          <div className="cb">
            {!selectedLead ? (
              <div className="dashboard-empty-state">
                Your AI agent will show live actions here once leads come in.
              </div>
            ) : (
              <div className="dashboard-lead-detail">
                <div className="dashboard-lead-detail-head">
                  <div>
                    <div className="dashboard-lead-detail-name">{selectedLead.contact_name || 'Unknown lead'}</div>
                    <div className="dashboard-lead-detail-meta">
                      {selectedLead.source_detail || selectedLead.source || 'web'} · {selectedLead.service_type || 'Needs qualification'}
                    </div>
                  </div>
                  <div className="dashboard-lead-detail-time">
                    {selectedLead.created_at ? formatTimeAgo(new Date(selectedLead.created_at)) : 'Just now'}
                  </div>
                </div>

                <div className="dashboard-detail-stats">
                  <div className="dashboard-detail-stat">
                    <span>Source</span>
                    <strong>{selectedLead.source || 'web'}</strong>
                  </div>
                  <div className="dashboard-detail-stat">
                    <span>Status</span>
                    <strong>{selectedStatus.label}</strong>
                  </div>
                  <div className="dashboard-detail-stat">
                    <span>Next move</span>
                    <strong>{selectedLead.qualification_status === 'qualified' ? 'Send estimate' : 'Qualify'}</strong>
                  </div>
                </div>

                <div className="dashboard-detail-activity">
                  {[
                    `Captured from ${selectedLead.source_detail || selectedLead.source || 'main source'}`,
                    selectedLead.contact_phone ? `Phone: ${selectedLead.contact_phone}` : 'No phone captured yet',
                    selectedLead.contact_email ? `Email: ${selectedLead.contact_email}` : 'No email captured yet',
                  ].map((item, index) => (
                    <div className="act-row" key={index}>
                      <div className="act-dot" style={{ background: ['var(--green)', 'var(--blue)', 'var(--amber)'][index] }} />
                      <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{item}</div>
                    </div>
                  ))}
                </div>

                <div className="dashboard-detail-actions">
                  <button className="btn btn-dark btn-sm" onClick={() => navigate('/app/leads')}>Open lead</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/conversations')}>Go to inbox</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/estimates')}>Draft estimate</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
