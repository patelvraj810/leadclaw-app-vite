import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsList } from '../data/conversations';

export function Leads() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = leadsList.filter(l => filter === 'All' || l.status === filter);

  return (
    <div className="page active" id="p-leads" style={{ padding: '24px' }}>
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
          <div className="tc">Lead</div>
          <div className="tc">Service</div>
          <div className="tc">Source</div>
          <div className="tc">Mode</div>
          <div className="tc">Status</div>
          <div className="tc">Time</div>
          <div className="tc"></div>
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
            <div className="tc"><span className={`mode-pill mode-${l.mode.toLowerCase()}`}>{l.mode}</span></div>
            <div className="tc"><span className={`tag ${l.tagCls}`}>{l.status}</span></div>
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
