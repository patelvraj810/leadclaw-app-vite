import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsList } from '../data/conversations';

export function Leads() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = leadsList.filter(l => filter === 'All' || l.status === filter);

  return (
    <div className="page-content active">
      <div className="leads-toolbar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input type="text" placeholder="Search leads..." />
        </div>
        {['All', 'Qualified', 'In Progress', 'No Response'].map(f => (
          <button 
            key={f} 
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      
      <div className="leads-table">
        <div className="t-header">
          <div>Lead</div>
          <div>Service</div>
          <div>Channel</div>
          <div>Status</div>
          <div>Time</div>
          <div></div>
        </div>
        
        {filtered.map((l, i) => (
          <div className="t-row" key={l.id}>
            <div className="t-name-cell">
              <div className="lead-av" style={{ 
                background: l.bgColor || (i === 0 ? '#7c3aed' : i === 1 ? '#2563eb' : i === 2 ? '#16a34a' : '#dc2626'), 
                width: '28px', height: '28px', fontSize: '10px' 
              }}>
                {l.av}
              </div>
              <div>
                <span>{l.name}</span>
                <div className="t-sub">{l.email}</div>
              </div>
            </div>
            <div className="t-cell">{l.service}</div>
            <div className="t-cell">{l.channel}</div>
            <div><span className={`tag ${l.tagCls}`}>{l.status}</span></div>
            <div className="t-cell mono" style={{ fontSize: '11px' }}>{l.time}</div>
            <div className="t-actions">
              <button className="icon-btn" onClick={() => navigate('/app/conversations?id=' + l.id)}>💬</button>
              <button className="icon-btn">✓</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
