import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';

export function Analytics() {
  return (
    <div className="page active" id="p-analytics">
      <div className="topbar">
        <div>
          <div className="tb-title">Analytics</div>
          <div className="tb-sub">Last 30 days</div>
        </div>
      </div>
      
      <div style={{ padding: '22px 24px' }}>
        <div className="kpi-grid">
          <KpiCard label="Total leads" value="64" change="↑ 34% this month" />
          <KpiCard label="Qualified" value="46" change="72% qual rate" />
          <KpiCard label="Booked" value="38" change="83% booking rate" />
          <KpiCard label="Est. revenue" value="$11k" change="from AI-captured leads" />
        </div>

        <div className="ag">
          <Card>
            <CardHeader><CardTitle>Leads by source</CardTitle></CardHeader>
            <CardBody>
              <div className="bg">
                <div className="bi">
                  <div className="bl">Facebook Groups</div>
                  <div className="bt"><div className="bf" style={{ width: '72%', background: 'var(--purple)' }}></div></div>
                  <div className="bv">18</div>
                </div>
                <div className="bi">
                  <div className="bl">Google Ads</div>
                  <div className="bt"><div className="bf" style={{ width: '60%' }}></div></div>
                  <div className="bv">15</div>
                </div>
                <div className="bi">
                  <div className="bl">Website Form</div>
                  <div className="bt"><div className="bf" style={{ width: '48%' }}></div></div>
                  <div className="bv">12</div>
                </div>
                <div className="bi">
                  <div className="bl">Instagram DMs</div>
                  <div className="bt"><div className="bf" style={{ width: '36%', background: 'var(--red)' }}></div></div>
                  <div className="bv">9</div>
                </div>
                <div className="bi">
                  <div className="bl">Facebook Ads</div>
                  <div className="bt"><div className="bf" style={{ width: '28%', background: '#1877f2' }}></div></div>
                  <div className="bv">7</div>
                </div>
                <div className="bi">
                  <div className="bl">Directory</div>
                  <div className="bt"><div className="bf" style={{ width: '12%', background: 'var(--green)' }}></div></div>
                  <div className="bv">3</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Response time</CardTitle></CardHeader>
            <CardBody>
              <div className="rt-big">
                <div className="rt-num">34s</div>
                <div className="rt-lbl">AI agent average</div>
                <div style={{ margin: '12px 0', fontSize: '12px', color: 'var(--text3)' }}>
                  Industry avg: <strong style={{ color: 'var(--red)' }}>4h 12m</strong>
                </div>
                <div style={{ padding: '10px 13px', background: 'var(--green-bg)', borderRadius: 'var(--r)', border: '1px solid var(--green-b)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: '600' }}>You are 450x faster than average</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>5-min response = 100x more conversions</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Agent mode breakdown</CardTitle></CardHeader>
            <CardBody>
              <div className="bg">
                <div className="bi">
                  <div className="bl">Qualifier</div>
                  <div className="bt"><div className="bf" style={{ width: '68%', background: 'var(--blue)' }}></div></div>
                  <div className="bv">44</div>
                </div>
                <div className="bi">
                  <div className="bl">Closer</div>
                  <div className="bt"><div className="bf" style={{ width: '59%', background: 'var(--green)' }}></div></div>
                  <div className="bv">38</div>
                </div>
                <div className="bi">
                  <div className="bl">Nurturer</div>
                  <div className="bt"><div className="bf" style={{ width: '28%', background: 'var(--purple)' }}></div></div>
                  <div className="bv">18</div>
                </div>
                <div className="bi">
                  <div className="bl">Hunter</div>
                  <div className="bt"><div className="bf" style={{ width: '22%', background: 'var(--amber)' }}></div></div>
                  <div className="bv">14</div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Conversion funnel</CardTitle></CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className="funnel-s">
                  <span>Leads captured</span><span className="fv">64</span>
                </div>
                <div className="funnel-s" style={{ marginLeft: '12px' }}>
                  <span>AI contacted</span><span className="fv">64 <span style={{ fontSize: '10px', color: 'var(--green)' }}>100%</span></span>
                </div>
                <div className="funnel-s" style={{ marginLeft: '24px' }}>
                  <span>Replied</span><span className="fv">46 <span style={{ fontSize: '10px', color: 'var(--green)' }}>72%</span></span>
                </div>
                <div className="funnel-s" style={{ marginLeft: '36px', background: 'var(--green-bg)', border: '1px solid var(--green-b)' }}>
                  <span style={{ color: 'var(--green)' }}>Appointments booked</span>
                  <span className="fv" style={{ color: 'var(--green)' }}>38 <span style={{ fontSize: '10px' }}>83%</span></span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
