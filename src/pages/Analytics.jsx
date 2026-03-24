import React, { useState, useEffect } from 'react';
import { fetchStats, fetchAnalytics } from '../lib/api';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';

export function Analytics() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const s = await fetchStats();
        setStats(s);
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
      try {
        const a = await fetchAnalytics();
        setAnalytics(a);
      } catch {
        setAnalyticsError(true);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="page active"><div className="loading">Loading...</div></div>;
  }

  const hasData = stats && (
    (stats.totalLeads > 0) ||
    (stats.totalConversations > 0) ||
    (stats.qualified > 0)
  );

  if (!hasData) {
    return (
      <div className="page active" id="p-analytics" style={{ padding: '0' }}>
        <div style={{ padding: '22px 24px' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '60vh', gap: '12px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
              No data yet
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '340px', lineHeight: 1.6 }}>
              Start capturing leads to see your analytics.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Derive source breakdown from analytics.leadsBySource or stats
  const leadsBySource = analytics?.leadsBySource || stats?.leadsBySource || {};
  const sourceEntries = Object.entries(leadsBySource).sort((a, b) => b[1] - a[1]);
  const maxSourceCount = sourceEntries.length > 0 ? sourceEntries[0][1] : 1;

  // Funnel
  const funnelTotal = stats?.totalLeads || 0;
  const funnelInProgress = stats?.inProgress || analytics?.inProgress || 0;
  const funnelQualified = stats?.qualified || 0;
  const conversionPct = funnelTotal > 0 ? Math.round((funnelQualified / funnelTotal) * 100) : 0;

  // Trends
  const thisMonth = stats?.thisMonth || analytics?.thisMonth || null;
  const lastMonth = stats?.lastMonth || analytics?.lastMonth || null;
  const trendDiff = (thisMonth != null && lastMonth != null)
    ? thisMonth - lastMonth
    : null;
  const trendPct = (trendDiff != null && lastMonth > 0)
    ? Math.round((trendDiff / lastMonth) * 100)
    : null;

  const qualRate = funnelTotal > 0 ? Math.round((funnelQualified / funnelTotal) * 100) : 0;

  return (
    <div className="page active" id="p-analytics" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>

        {/* KPI row */}
        <div className="kpi-grid" style={{ marginBottom: '20px' }}>
          <KpiCard label="Total leads" value={stats?.totalLeads ?? '—'} change="" />
          <KpiCard label="Qualified" value={`${stats?.qualified ?? '—'}${funnelTotal > 0 ? ` (${qualRate}%)` : ''}`} change="" />
          <KpiCard label="Active conversations" value={stats?.totalConversations ?? '—'} change="" />
          <KpiCard label="Avg response time" value={stats?.avgResponse ?? '—'} change="Industry avg: 4 hrs" />
        </div>

        <div className="ag" style={{ marginBottom: '20px' }}>

          {/* Lead source breakdown */}
          <Card>
            <CardHeader><CardTitle>Lead source breakdown</CardTitle></CardHeader>
            <CardBody>
              {sourceEntries.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--text3)', textAlign: 'center', padding: '20px' }}>
                  No source data available yet.
                </div>
              ) : (
                <div className="bg">
                  {sourceEntries.map(([src, count]) => (
                    <div key={src} className="bi">
                      <div className="bl" style={{ textTransform: 'capitalize' }}>{src}</div>
                      <div className="bt">
                        <div
                          className="bf"
                          style={{ width: `${Math.round((count / maxSourceCount) * 100)}%` }}
                        />
                      </div>
                      <div className="bv">{count}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Qualification funnel */}
          <Card>
            <CardHeader><CardTitle>Qualification funnel</CardTitle></CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="funnel-s">
                  <span>New leads</span>
                  <span className="fv">{funnelTotal}</span>
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
                  <div className="rt-num" style={{ fontSize: '36px' }}>{conversionPct}%</div>
                  <div className="rt-lbl">conversion rate</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent trends */}
        {(thisMonth != null || trendDiff != null) && (
          <Card>
            <CardHeader><CardTitle>Recent trends</CardTitle></CardHeader>
            <CardBody>
              <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>
                {thisMonth != null && (
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--text)' }}>{thisMonth}</span> leads this month
                    {lastMonth != null && (
                      <span> vs <span style={{ fontWeight: '600', color: 'var(--text)' }}>{lastMonth}</span> last month</span>
                    )}
                    {trendPct != null && (
                      <span style={{ color: trendDiff >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: '600', marginLeft: '6px' }}>
                        ({trendDiff >= 0 ? '+' : ''}{trendPct}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
              {analyticsError && (
                <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                  Full analytics endpoint not yet available — showing stats data only.
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {analyticsError && !thisMonth && (
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", marginTop: '8px' }}>
            Full analytics endpoint not yet available — showing stats data only.
          </div>
        )}

      </div>
    </div>
  );
}
