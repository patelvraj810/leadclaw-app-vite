import { useState, useEffect } from 'react';
import { fetchStats, fetchAnalytics, fetchEstimates, fetchJobs } from '../lib/api';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';
import { PageHero } from '../components/ui/PageHero';

// ─── Mini bar chart (7-day sparkline via CSS) ─────────────────────────────────
function MiniBarChart({ data, color = 'var(--blue)' }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '40px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <div
            style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              background: d.count > 0 ? color : 'var(--surface3)',
              height: `${Math.max(4, Math.round((d.count / max) * 36))}px`,
              transition: 'height .2s',
            }}
            title={`${d.date}: ${d.count}`}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Horizontal bar row ───────────────────────────────────────────────────────
function BarRow({ label, value, max, color = 'var(--blue)' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 36px', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ fontSize: '12px', color: 'var(--text2)', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ height: '8px', borderRadius: '4px', background: 'var(--surface3)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px', transition: 'width .3s' }} />
      </div>
      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    </div>
  );
}

// ─── Pipeline row ─────────────────────────────────────────────────────────────
function PipelineRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface2)', borderRadius: '8px', marginBottom: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{label}</span>
      </div>
      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
    </div>
  );
}

export function Analytics() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchStats(),
      fetchAnalytics(),
      fetchEstimates(),
      fetchJobs(),
    ]).then(([statsRes, analyticsRes, estRes, jobsRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value);
      if (estRes.status === 'fulfilled') setEstimates(Array.isArray(estRes.value) ? estRes.value : []);
      if (jobsRes.status === 'fulfilled') setJobs(Array.isArray(jobsRes.value) ? jobsRes.value : []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page active"><div className="loading">Loading...</div></div>;
  }

  // ── Leads / conversations data ─────────────────────────────────────────────
  const totalLeads = analytics?.totalLeads || stats?.totalLeads || 0;
  const funnelQualified = stats?.qualified || 0;
  const totalConversations = analytics?.totalConversations || stats?.totalConversations || 0;
  const qualRate = totalLeads > 0 ? Math.round((funnelQualified / totalLeads) * 100) : 0;

  const hasAnyData = totalLeads > 0 || estimates.length > 0 || jobs.length > 0;

  if (!hasAnyData) {
    return (
      <div className="page active" id="p-analytics">
        <PageHero eyebrow="Performance" title="Analytics" subtitle="Revenue, lead flow, and conversion data across your entire pipeline." />
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>No data yet</div>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Start capturing leads to see your analytics.</div>
        </div>
      </div>
    );
  }

  // ── Last 7 days spark ──────────────────────────────────────────────────────
  const leadsPerDay = analytics?.leadsPerDay || [];
  const last7 = leadsPerDay.slice(-7);

  // ── Source breakdown ───────────────────────────────────────────────────────
  const byChannel = analytics?.leadsByChannel || analytics?.byChannel || {};
  const sourceEntries = Object.entries(byChannel).sort((a, b) => b[1] - a[1]);
  const maxSource = sourceEntries.length > 0 ? sourceEntries[0][1] : 1;

  // ── Estimates pipeline ─────────────────────────────────────────────────────
  const estByStatus = {};
  estimates.forEach(e => { estByStatus[e.status] = (estByStatus[e.status] || 0) + 1; });
  const estTotal = estimates.length;
  const estRevenue = estimates
    .filter(e => ['approved', 'deposit_paid', 'converted'].includes(e.status))
    .reduce((sum, e) => sum + Number(e.total || 0), 0);
  const conversionRate = estTotal > 0
    ? Math.round(((estByStatus.approved || 0) + (estByStatus.deposit_paid || 0) + (estByStatus.converted || 0)) / estTotal * 100)
    : 0;

  // ── Jobs pipeline ──────────────────────────────────────────────────────────
  const jobsByStatus = {};
  jobs.forEach(j => { jobsByStatus[j.status] = (jobsByStatus[j.status] || 0) + 1; });
  const completedRevenue = jobs
    .filter(j => j.status === 'completed' && j.price)
    .reduce((sum, j) => sum + Number(j.price || 0), 0);

  // Jobs by technician
  const jobsByTech = {};
  jobs.forEach(j => {
    const techName = j.technician?.name || j.technician_name || null;
    if (techName) {
      if (!jobsByTech[techName]) jobsByTech[techName] = { total: 0, completed: 0 };
      jobsByTech[techName].total++;
      if (j.status === 'completed') jobsByTech[techName].completed++;
    }
  });
  const techEntries = Object.entries(jobsByTech).sort((a, b) => b[1].total - a[1].total);
  const maxTechJobs = techEntries.length > 0 ? techEntries[0][1].total : 1;

  // ── Funnel ─────────────────────────────────────────────────────────────────
  const funnelInProgress = analytics?.qualificationFunnel?.in_progress || stats?.inProgress || 0;

  return (
    <div className="page active" id="p-analytics">
      <PageHero
        eyebrow="Performance"
        title="Analytics"
        subtitle="Revenue, lead flow, and conversion data across your entire pipeline."
        stat={{ value: `${qualRate}%`, label: 'Qualification rate' }}
      />
      <div style={{ padding: '0 0 32px' }}>

        {/* KPI row */}
        <div className="kpi-grid" style={{ marginBottom: '24px' }}>
          <KpiCard label="Total leads" value={totalLeads} change="" />
          <KpiCard label="Qualified" value={`${funnelQualified}${totalLeads > 0 ? ` (${qualRate}%)` : ''}`} change="" />
          <KpiCard label="Conversations" value={totalConversations} change="" />
          <KpiCard label="Avg response" value={stats?.avgResponseTime ?? '—'} change="" />
        </div>

        {/* Last 7 days + source breakdown */}
        <div className="ag" style={{ marginBottom: '20px' }}>
          {/* 7-day lead volume */}
          {last7.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Leads — last 7 days</CardTitle>
              </CardHeader>
              <CardBody>
                <MiniBarChart data={last7} color="var(--blue)" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {last7[0]?.date}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {last7[last7.length - 1]?.date}
                  </span>
                </div>
                {analytics?.avgLeadsPerWeek != null && (
                  <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text2)' }}>
                    Avg <strong>{analytics.avgLeadsPerWeek}</strong> leads / week (last 30 days)
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Lead sources */}
          <Card>
            <CardHeader><CardTitle>Lead source breakdown</CardTitle></CardHeader>
            <CardBody>
              {sourceEntries.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>
                  No source data yet.
                </div>
              ) : (
                sourceEntries.map(([src, count]) => (
                  <BarRow key={src} label={src} value={count} max={maxSource} color="var(--blue)" />
                ))
              )}
            </CardBody>
          </Card>
        </div>

        {/* Estimates pipeline */}
        {estTotal > 0 && (
          <Card style={{ marginBottom: '20px' }}>
            <CardHeader>
              <CardTitle>Estimates pipeline</CardTitle>
              <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {estTotal}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>total</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--green)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {conversionRate}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>approval rate</div>
                </div>
                {estRevenue > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      ${estRevenue.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>approved value</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {[
                  { label: 'Draft', key: 'draft', color: 'var(--text3)' },
                  { label: 'Sent', key: 'sent', color: 'var(--blue)' },
                  { label: 'Approved', key: 'approved', color: 'var(--green)' },
                  { label: 'Deposit paid', key: 'deposit_paid', color: 'var(--green)' },
                  { label: 'Converted to job', key: 'converted', color: 'var(--blue)' },
                  { label: 'Declined', key: 'declined', color: 'var(--red)' },
                ].map(({ label, key, color }) => (
                  (estByStatus[key] || 0) > 0 ? (
                    <PipelineRow key={key} label={label} value={estByStatus[key] || 0} color={color} />
                  ) : null
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Jobs pipeline */}
        {jobs.length > 0 && (
          <div className="ag" style={{ marginBottom: '20px' }}>
            <Card>
              <CardHeader>
                <CardTitle>Jobs overview</CardTitle>
                {completedRevenue > 0 && (
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--green)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      ${completedRevenue.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>completed revenue</div>
                  </div>
                )}
              </CardHeader>
              <CardBody>
                {[
                  { label: 'Scheduled', key: 'scheduled', color: 'var(--blue)' },
                  { label: 'Confirmed', key: 'confirmed', color: 'var(--blue)' },
                  { label: 'In progress', key: 'in_progress', color: 'var(--amber)' },
                  { label: 'Completed', key: 'completed', color: 'var(--green)' },
                  { label: 'Cancelled', key: 'cancelled', color: 'var(--text3)' },
                ].map(({ label, key, color }) => (
                  (jobsByStatus[key] || 0) > 0 ? (
                    <PipelineRow key={key} label={label} value={jobsByStatus[key] || 0} color={color} />
                  ) : null
                ))}
              </CardBody>
            </Card>

            {/* Jobs by technician */}
            {techEntries.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Jobs by technician</CardTitle></CardHeader>
                <CardBody>
                  {techEntries.map(([name, counts]) => (
                    <div key={name} style={{ marginBottom: '10px' }}>
                      <BarRow label={name} value={counts.total} max={maxTechJobs} color="var(--text)" />
                      {counts.completed > 0 && (
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: '130px', marginTop: '-6px', marginBottom: '4px' }}>
                          {counts.completed} completed
                        </div>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* Qualification funnel */}
        {totalLeads > 0 && (
          <Card style={{ marginBottom: '20px' }}>
            <CardHeader><CardTitle>Lead qualification funnel</CardTitle></CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="funnel-s">
                  <span>New leads</span>
                  <span className="fv">{totalLeads}</span>
                </div>
                <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text3)' }}>↓</div>
                <div className="funnel-s">
                  <span>In progress</span>
                  <span className="fv">{funnelInProgress}</span>
                </div>
                <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text3)' }}>↓</div>
                <div className="funnel-s" style={{ background: 'var(--green-bg)', border: '1px solid var(--green-b)' }}>
                  <span style={{ color: 'var(--green)', fontWeight: '500' }}>Qualified</span>
                  <span className="fv" style={{ color: 'var(--green)' }}>{funnelQualified}</span>
                </div>
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <div className="rt-num" style={{ fontSize: '36px' }}>{qualRate}%</div>
                  <div className="rt-lbl">conversion rate</div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

      </div>
    </div>
  );
}

