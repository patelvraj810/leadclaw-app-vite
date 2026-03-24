import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import { Tag } from '../components/ui/Tag';
import { fetchStats, fetchLeads } from '../lib/api';

function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, leadsData] = await Promise.all([
          fetchStats(),
          fetchLeads()
        ]);
        setStats(statsData);
        setLeads(Array.isArray(leadsData) ? leadsData : []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Dynamic checklist: items 0–2 are always done (account + profile + email)
  // Item 3 done when agent settings exist (stats.agentConfigured)
  // Item 4 done when at least one conversation or lead exists
  const checklistItems = useMemo(() => [
    { label: 'Create account', sub: null, done: true },
    { label: 'Business profile', sub: null, done: true },
    { label: 'Email channel connected', sub: null, done: true },
    { label: 'Set up your AI agent personality', sub: 'Give it a name, tone and opening message', done: !!(stats?.agentConfigured), route: '/app/agent', cta: 'Set up →', ctaClass: 'btn-dark' },
    { label: 'Connect your first lead source', sub: 'Website form, Google Ads, Facebook — your choice', done: !!(stats?.totalConversations > 0 || leads.length > 0), route: '/app/sources', cta: 'Connect →', ctaClass: 'btn-ghost' },
  ], [stats, leads]);

  const doneCount = checklistItems.filter(i => i.done).length;
  const totalCount = checklistItems.length;
  const progressPct = Math.round((doneCount / totalCount) * 100);
  const allDone = doneCount === totalCount;

  if (loading) {
    return <div className="page"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="page active" id="p-dash" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>
        <section className="dash-hero">
          <div className="dash-hero-copy">
            <div className="dash-hero-eyebrow">Live revenue engine</div>
            <h2 className="dash-hero-title">Your AI agent is actively converting demand into booked conversations.</h2>
            <p className="dash-hero-sub">
              Track live lead flow, agent actions, and conversion momentum from one place without digging through disconnected tools.
            </p>
            <div className="dash-hero-actions">
              <button className="btn btn-dark" onClick={() => navigate('/app/conversations')}>Open live inbox</button>
              <button className="btn btn-ghost" onClick={() => navigate('/app/analytics')}>View conversion analytics</button>
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

        <div className="kpi-grid">
          <KpiCard label="Leads today" value={stats?.leadsToday || '—'} change={stats?.leadsTodayChange || '↑ 3 more than yesterday'} />
          <KpiCard label="Qualified" value={stats?.qualified || '—'} change={stats?.qualifiedChange || '71% qual rate'} />
          <KpiCard label="Avg response" value={stats?.avgResponse || '—'} change="Industry avg: 4 hrs" />
          <KpiCard label="This month" value={stats?.thisMonth || '—'} change={stats?.thisMonthChange || '↑ 34% vs last month'} />
        </div>

        {/* Setup Checklist */}
        {!allDone && (
          <Card style={{ marginBottom: '18px', borderColor: 'var(--text)' }}>
            <div className="ch" style={{ background: 'var(--text)' }}>
              <div className="ct" style={{ color: '#fff' }}>
                {doneCount === totalCount ? '✓ Setup complete!' : `Finish your setup — ${totalCount - doneCount} step${totalCount - doneCount !== 1 ? 's' : ''} left`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100px', height: '5px', background: 'rgba(255,255,255,.2)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPct}%`, height: '100%', background: '#fff', borderRadius: '3px' }}></div>
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.6)' }}>{doneCount}/{totalCount}</span>
              </div>
            </div>
            <CardBody>
              {checklistItems.map((item, idx) => (
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
                    {item.sub && !item.done && <div className="cl-sub">{item.sub}</div>}
                  </div>
                  {item.done
                    ? <Tag color="green" style={{ fontSize: '11px' }}>Done</Tag>
                    : item.cta && <button className={`btn ${item.ctaClass} btn-sm`}>{item.cta}</button>
                  }
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        <div className="dash-grid">
          <Card>
            <CardHeader>
              <CardTitle>New leads</CardTitle>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/leads')}>View all</button>
            </CardHeader>
            <CardBody>
              {leads.slice(0, 4).map((l, i) => {
                const initials = l.contact_name 
                  ? l.contact_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                  : '??';
                const timeAgo = l.created_at ? formatTimeAgo(new Date(l.created_at)) : 'Just now';
                const statusMap = {
                  'qualified': { label: 'Qualified', color: 'green' },
                  'in_progress': { label: 'In Progress', color: 'blue' },
                  'pending': { label: 'New', color: 'purple' },
                  'disqualified': { label: 'Lost', color: 'red' }
                };
                const statusInfo = statusMap[l.qualification_status] || { label: 'New', color: 'purple' };
                return (
                  <div className="lead-row" key={l.id}>
                    <div className="lav" style={{ background: i === 0 ? 'var(--purple)' : i === 1 ? 'var(--blue)' : i === 2 ? 'var(--green)' : 'var(--red)' }}>
                      {initials}
                    </div>
                    <div className="li">
                      <div className="ln">{l.contact_name || 'Unknown'}</div>
                      <div className="ld">{l.source_detail || l.source || 'Lead'} · via {l.source || 'web'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Tag color={statusInfo.color} style={{ fontSize: '10px' }}>{statusInfo.label}</Tag>
                      <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px', fontFamily: "'JetBrains Mono', monospace" }}>{timeAgo}</div>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Card className="activity-card">
            <CardHeader>
              <CardTitle>Agent activity</CardTitle>
              <Tag color="green" style={{ fontSize: '11px' }}>Live</Tag>
            </CardHeader>
            <CardBody>
              {leads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)', fontSize: '13px' }}>
                  No activity yet. Your AI agent will show live actions here once leads come in.
                </div>
              ) : (
                leads.slice(0, 4).map((l, i) => {
                  const colors = ['var(--green)', 'var(--amber)', 'var(--purple)', 'var(--text3)'];
                  return (
                    <div className="act-row" key={l.id}>
                      <div className="act-dot" style={{ background: colors[i % 4] }}></div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '500' }}>{l.contact_name || 'Unknown lead'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                          {l.source_detail || l.source || 'web'} · {l.qualification_status} · <span className={`mode-pill mode-${l.qualification_status === 'qualified' ? 'closer' : 'qualifier'}`} style={{ fontSize: '9px', padding: '1px 6px' }}>{l.qualification_status === 'qualified' ? 'Closer' : 'Qualifier'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
