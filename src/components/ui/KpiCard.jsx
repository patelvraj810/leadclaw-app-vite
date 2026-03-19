import React from 'react';

export function KpiCard({ label, value, change, isDown = false }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-change ${isDown ? 'down' : ''}`}>{change}</div>
    </div>
  );
}
