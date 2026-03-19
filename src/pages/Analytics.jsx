import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { KpiCard } from '../components/ui/KpiCard';

export function Analytics() {
  return (
    <div className="page active" id="p-analytics">
      <div className="kpi-grid">
        <KpiCard label="Total leads" value="47" change="↑ 18% this month" />
        <KpiCard label="Qualified" value="34" change="72% qual rate" />
        <KpiCard label="Appointments" value="28" change="82% booking rate" />
        <KpiCard label="Est. revenue" value="$8.4k" change="saved from lost leads" />
      </div>

      <div className="ag">
        <Card>
          <CardHeader>
            <CardTitle>Leads by source</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="bg">
              <div className="bi">
                <div className="bl">Google Ads</div>
                <div className="bt"><div className="bf" style={{ width: '78%' }}></div></div>
                <div className="bv">19</div>
              </div>
              <div className="bi">
                <div className="bl">Website form</div>
                <div className="bt"><div className="bf" style={{ width: '52%' }}></div></div>
                <div className="bv">13</div>
              </div>
              <div className="bi">
                <div className="bl">Referral</div>
                <div className="bt"><div className="bf" style={{ width: '36%' }}></div></div>
                <div className="bv">9</div>
              </div>
              <div className="bi">
                <div className="bl">Social</div>
                <div className="bt"><div className="bf" style={{ width: '24%' }}></div></div>
                <div className="bv">6</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response time</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="rt-big">
              <div className="rt-num">34s</div>
              <div className="rt-lbl">Your AI agent average</div>
              <div style={{ margin: '14px 0', fontSize: '13px', color: 'var(--text3)' }}>
                Industry avg: <strong style={{ color: 'var(--red)' }}>4h 12m</strong>
              </div>
              <div style={{ padding: '11px 14px', background: 'var(--green-bg)', borderRadius: 'var(--r)', border: '1px solid var(--green-b)' }}>
                <div style={{ fontSize: '13px', color: 'var(--green)', fontWeight: '500' }}>You are 450x faster than average</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>5-min response = 100x more conversions</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service breakdown</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="bg">
              <div className="bi">
                <div className="bl">HVAC Repair</div>
                <div className="bt"><div className="bf" style={{ width: '68%' }}></div></div>
                <div className="bv">16</div>
              </div>
              <div className="bi">
                <div className="bl">Installation</div>
                <div className="bt"><div className="bf" style={{ width: '44%' }}></div></div>
                <div className="bv">11</div>
              </div>
              <div className="bi">
                <div className="bl">Maintenance</div>
                <div className="bt"><div className="bf" style={{ width: '36%' }}></div></div>
                <div className="bv">9</div>
              </div>
              <div className="bi">
                <div className="bl">Inspection</div>
                <div className="bt"><div className="bf" style={{ width: '20%' }}></div></div>
                <div className="bv">5</div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion funnel</CardTitle>
          </CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <div className="funnel-s">
                <span>Leads received</span><span className="fv">47</span>
              </div>
              <div className="funnel-s" style={{ marginLeft: '14px' }}>
                <span>AI contacted</span><span className="fv">47 <span style={{ fontSize: '11px', color: 'var(--green)' }}>100%</span></span>
              </div>
              <div className="funnel-s" style={{ marginLeft: '28px' }}>
                <span>Replied to AI</span><span className="fv">34 <span style={{ fontSize: '11px', color: 'var(--green)' }}>72%</span></span>
              </div>
              <div className="funnel-s" style={{ marginLeft: '42px', background: 'var(--green-bg)', border: '1px solid var(--green-b)' }}>
                <span style={{ color: 'var(--green)' }}>Appointments booked</span>
                <span className="fv" style={{ color: 'var(--green)' }}>28 <span style={{ fontSize: '11px' }}>82%</span></span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
