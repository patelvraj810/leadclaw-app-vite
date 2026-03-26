import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [query, setQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  useEffect(() => {
    fetchLeads()
      .then(data => {
        const safeLeads = Array.isArray(data) ? data : [];
        setLeads(safeLeads);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load leads:', err);
        setLoading(false);
      });
  }, []);

  const filtered = leads.filter((lead) => {
    const matchesFilter = filter === 'All' || lead.qualification_status === filter.toLowerCase().replace(' ', '_');
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return matchesFilter;
    const haystack = [
      lead.contact_name,
      lead.contact_email,
      lead.contact_phone,
      lead.source,
      lead.service_needed,
      lead.notes,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return matchesFilter && haystack.includes(normalizedQuery);
  });

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;

  if (leads.length === 0) return <div className="page"><div className="empty-state">No leads yet. Add your first lead to get started!</div></div>;

  const selectedLead = filtered.find((lead) => lead.id === selectedLeadId) || filtered[0] || null;

  return (
    <div className="page active surface-page" id="p-leads" style={{ padding: '24px' }}>
      <section className="page-hero leads-hero">
        <div>
          <div className="page-eyebrow">Lead pipeline</div>
          <h1 className="page-title">Every lead, one clean queue.</h1>
          <p className="page-subtitle">
            Review incoming demand, jump into the conversation, and turn the right opportunities into estimates fast.
          </p>
        </div>
        <div className="page-stat-chip">
          <strong>{filtered.length}</strong>
          <span>{filter === 'All' ? 'visible leads' : `${filter.toLowerCase()} leads`}</span>
        </div>
      </section>

      <div className="toolbar-shell">
        <div className="leads-toolbar">
          <div className="srch">
            <input
              type="text"
              placeholder="Search by name, email, phone, source, or service"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
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
      </div>

      <div className="leads-layout">
        <div className="tbl leads-table-shell leads-table-panel">
          <div className="th">
            <div className="tc">Lead</div>
            <div className="tc">Source</div>
            <div className="tc">Status</div>
            <div className="tc">Time</div>
            <div className="tc"></div>
          </div>

          {filtered.map((lead) => {
            const initials = lead.contact_name
              ? lead.contact_name.split(' ').map((name) => name[0]).join('').toUpperCase().slice(0, 2)
              : '??';
            const timeAgo = lead.created_at ? formatTimeAgo(new Date(lead.created_at)) : 'Just now';
            const statusMap = {
              qualified: { label: 'Qualified', color: 'green' },
              in_progress: { label: 'In Progress', color: 'blue' },
              pending: { label: 'New', color: 'purple' },
              disqualified: { label: 'Lost', color: 'red' },
            };
            const statusInfo = statusMap[lead.qualification_status] || { label: 'New', color: 'purple' };
            const isSelected = selectedLead?.id === lead.id;

            return (
              <div
                className={`tr${isSelected ? ' lead-row-selected' : ''}`}
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
              >
                <div className="tnc">
                  <div className="lav leads-avatar">
                    {initials}
                  </div>
                  <div>
                    <span>{lead.contact_name || 'Unknown'}</span>
                    <div className="tsub">{lead.contact_email || lead.contact_phone || 'No contact details'}</div>
                  </div>
                </div>
                <div className="tc">{lead.source || '—'}</div>
                <div className="tc"><span className={`tag tag-${statusInfo.color}`}>{statusInfo.label}</span></div>
                <div className="tc" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{timeAgo}</div>
                <div className="tc" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    className="lead-row-action icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/app/conversations?id=${lead.id}`);
                    }}
                    aria-label="Open conversation"
                    title="Open conversation"
                  >
                    💬
                  </button>
                  <button
                    className="lead-row-action cta"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate('/app/estimates', { state: { createForLead: lead } });
                    }}
                  >
                    + Estimate
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="lead-detail-panel">
          {selectedLead ? (
            <>
              <div className="lead-detail-head">
                <div className="lead-detail-title">
                  <div className="lead-detail-avatar">
                    {(selectedLead.contact_name || 'Unknown')
                      .split(' ')
                      .map((name) => name[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="lead-detail-name">{selectedLead.contact_name || 'Unknown contact'}</div>
                    <div className="lead-detail-meta">
                      Added {selectedLead.created_at ? formatTimeAgo(new Date(selectedLead.created_at)) : 'recently'}
                    </div>
                  </div>
                </div>
                <span className={`tag tag-${({ qualified: 'green', in_progress: 'blue', pending: 'purple', disqualified: 'red' }[selectedLead.qualification_status] || 'purple')}`}>
                  {selectedLead.qualification_status?.replace('_', ' ') || 'new'}
                </span>
              </div>

              <div className="lead-detail-grid">
                <div className="lead-detail-stat">
                  <div className="lead-detail-stat-label">Source</div>
                  <div className="lead-detail-stat-value">{selectedLead.source || 'Unknown'}</div>
                </div>
                <div className="lead-detail-stat">
                  <div className="lead-detail-stat-label">Service</div>
                  <div className="lead-detail-stat-value">{selectedLead.service_needed || 'General inquiry'}</div>
                </div>
                <div className="lead-detail-stat">
                  <div className="lead-detail-stat-label">Email</div>
                  <div className="lead-detail-stat-value">{selectedLead.contact_email || 'No email on file'}</div>
                </div>
                <div className="lead-detail-stat">
                  <div className="lead-detail-stat-label">Phone</div>
                  <div className="lead-detail-stat-value">{selectedLead.contact_phone || 'No phone on file'}</div>
                </div>
              </div>

              <div className="lead-detail-section">
                <div className="lead-detail-section-title">Lead context</div>
                <div className="lead-detail-copy">
                  {selectedLead.notes || selectedLead.message || 'No additional notes yet. Open the conversation to continue qualifying the lead or move them into an estimate.'}
                </div>
              </div>

              <div className="lead-detail-section">
                <div className="lead-detail-section-title">Next best move</div>
                <div className="lead-detail-copy">
                  {selectedLead.qualification_status === 'qualified'
                    ? 'Draft an estimate while the opportunity is warm, then move toward approval and booking.'
                    : selectedLead.qualification_status === 'in_progress'
                      ? 'Keep the conversation active, answer objections, and prepare the handoff into estimates or jobs.'
                      : 'Open the thread, qualify urgency, and gather the missing details needed to quote confidently.'}
                </div>
              </div>

              <div className="lead-detail-actions">
                <button className="btn btn-dark" onClick={() => navigate(`/app/conversations?id=${selectedLead.id}`)}>
                  Open conversation
                </button>
                <button className="btn btn-ghost" onClick={() => navigate('/app/estimates', { state: { createForLead: selectedLead } })}>
                  Create estimate
                </button>
              </div>
            </>
          ) : (
            <div className="lead-detail-empty">
              No leads match this filter yet. Try a different status or broaden your search.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
