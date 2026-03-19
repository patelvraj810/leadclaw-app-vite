import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsList } from '../data/conversations';

export function Leads() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = leadsList.filter(l => filter === 'All' || l.status === filter);

  return (
    <div className="page active" id="p-leads">
      <div className="topbar">
        <div>
          <div className="tb-title">Leads</div>
          <div className="tb-sub">All leads captured by your AI agent</div>
        </div>
        <div style={{ display: 'flex', gap: '9px', alignItems: 'center' }}>
          <button className="btn btn-dark btn-sm">+ Add lead</button>
        </div>
      </div>
      <div className="leads-toolbar">
        <div className="srch">
          <input type="text" placeholder="Search leads..." />
        </div>
        {['All', 'Qualified', 'In Progress', 'No Response'].map(f => (
          <button 
            key={f} 
            className={`fbtn ${filter === f ? 'on' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      
      <div className="tbl">
        <div className="th">
          <div>Lead</div>
          <div>Service</div>
          <div>Source</div>
          <div>Mode</div>
          <div>Status</div>
          <div>Time</div>
          <div></div>
        </div>
        
        {filtered.map((l, i) => (
          <div className="tr" key={l.id} onClick={() => navigate('/app/conversations?id=' + l.id)}>
            <div className="tnc">
              <div className="lav" style={{ 
                background: l.bgColor || (i === 0 ? 'var(--purple)' : i === 1 ? 'var(--blue)' : i === 2 ? 'var(--green)' : 'var(--red)') 
              }}>
                {l.av}
              </div>
              <div>
                <span>{l.name}</span>
                <div className="tsub">{l.email}</div>
              </div>
            </div>
            <div className="tc">{l.service}</div>
            <div className="tc">{l.source}</div>
            <div><span className={`mode-pill mode-${l.mode.toLowerCase()}`}>{l.mode}</span></div>
            <div><span className={`tag ${l.tagCls}`}>{l.status}</span></div>
            <div className="tc" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{l.time}</div>
            <div className="tc" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.6 }}>💬</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
