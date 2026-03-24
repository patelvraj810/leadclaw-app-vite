import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsList } from '../data/conversations';
import { fetchLeads } from '../lib/api';

function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function Leads() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads()
      .then(data => {
        setLeads(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load leads:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;

  const filtered = leads.filter(l => filter === 'All' || l.qualification_status === filter.toLowerCase().replace(' ', '_'));

  if (leads.length === 0) return <div className="page"><div className="empty-state">No leads yet. Add your first lead to get started!</div></div>;

  return (
    <div className="page active" id="p-leads" style={{ padding: '24px' }}>
      <div className="leads-toolbar">
        <div className="srch">
          <input type="text" placeholder="Search leads..." />
        </div>
        {['All', 'Qualified', 'In Progress', 'Pending'].map(f => (
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
          <div className="tc">Source Detail</div>
          <div className="tc">Source</div>
          <div className="tc">Status</div>
          <div className="tc">Time</div>
          <div className="tc"></div>
        </div>
        
        {filtered.map((l, i) => {
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
            <div className="tr" key={l.id} onClick={() => navigate('/app/conversations?id=' + l.id)}>
              <div className="tnc">
                <div className="lav" style={{ background: 'var(--purple)' }}>
                  {initials}
                </div>
                <div>
                  <span>{l.contact_name || 'Unknown'}</span>
                  <div className="tsub">{l.contact_email || 'No email'}</div>
                </div>
              </div>
              <div className="tc">{l.source || '—'}</div>
              <div className="tc"><span className={`tag tag-${statusInfo.color}`}>{statusInfo.label}</span></div>
              <div className="tc" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{timeAgo}</div>
              <div className="tc" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.6 }}>💬</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
