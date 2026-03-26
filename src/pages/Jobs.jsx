import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, createJob, updateJob, fetchTeam } from '../lib/api';
import { Tag } from '../components/ui/Tag';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';

const STATUS_CONFIG = {
  scheduled:   { color: 'gray',   label: 'Scheduled' },
  confirmed:   { color: 'blue',   label: 'Confirmed' },
  in_progress: { color: 'amber',  label: 'In Progress' },
  completed:   { color: 'green',  label: 'Completed' },
  cancelled:   { color: 'red',    label: 'Cancelled' },
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function weekEnd() {
  const d = new Date();
  d.setDate(d.getDate() + (6 - d.getDay()));
  return d.toISOString().slice(0, 10);
}

const EMPTY_FORM = {
  customer_name: '',
  customer_phone: '',
  job_description: '',
  service_type: '',
  address: '',
  scheduled_date: '',
  scheduled_time: '',
  duration_hours: '',
  price: '',
  notes: '',
  technician_id: '',
};

// Resolve display name for a job — prefers relational join, falls back to legacy text
function techDisplayName(job) {
  return job.technician?.name || job.technician_name || null;
}

// Initials from a name string
function initials(name) {
  return (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}

// ─── Technician avatar badge ───────────────────────────────────────────────────
function TechBadge({ name, size = 24 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'var(--blue)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.floor(size * 0.38) + 'px', fontWeight: '700',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {initials(name)}
    </div>
  );
}

// ─── Inline reassign picker ────────────────────────────────────────────────────
function ReassignPicker({ job, team, onReassign }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const current = techDisplayName(job);

  const handleSelect = async (e) => {
    const techId = e.target.value;
    setLoading(true);
    try {
      const updated = await updateJob(job.id, { technician_id: techId || null });
      onReassign(updated);
    } catch (err) {
      alert(err.message || 'Reassignment failed');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (loading) return <span style={{ fontSize: '11px', color: 'var(--text3)' }}>Saving…</span>;

  if (open) {
    return (
      <select
        autoFocus
        defaultValue={job.technician_id || ''}
        onChange={handleSelect}
        onBlur={() => setOpen(false)}
        style={{ fontSize: '12px', padding: '3px 6px', borderRadius: '6px' }}
      >
        <option value="">— Unassigned —</option>
        {team.map(m => (
          <option key={m.id} value={m.id}>{m.name}{m.title ? ` · ${m.title}` : ''}</option>
        ))}
      </select>
    );
  }

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={() => setOpen(true)}
      style={{ fontSize: '11px', padding: '2px 8px' }}
    >
      {current ? 'Reassign' : 'Assign'}
    </button>
  );
}

// ─── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job, team, onMarkComplete, onReassign, onCreateInvoice }) {
  const cfg = STATUS_CONFIG[job.status] || { color: 'gray', label: job.status || 'Unknown' };
  const canComplete = job.status === 'confirmed' || job.status === 'in_progress';
  const techName = techDisplayName(job);
  const isActive = !['completed', 'cancelled'].includes(job.status);

  return (
    <Card>
      <CardBody>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Customer + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{job.customer_name || 'Unknown customer'}</span>
              <Tag color={cfg.color} style={{ fontSize: '10px' }}>{cfg.label}</Tag>
            </div>

            {/* Description */}
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px' }}>
              {job.job_description || job.service_type || '—'}
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              {job.scheduled_date && (
                <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {job.scheduled_date}{job.scheduled_time ? ` at ${job.scheduled_time.slice(0, 5)}` : ''}
                </span>
              )}
              {job.address && (
                <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{job.address}</span>
              )}
              {job.customer_phone && (
                <a href={`tel:${job.customer_phone}`} style={{ fontSize: '11px', color: 'var(--text3)', textDecoration: 'none' }}>
                  {job.customer_phone}
                </a>
              )}
            </div>

            {/* Tech row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              {techName ? (
                <>
                  <TechBadge name={techName} size={22} />
                  <span style={{ fontSize: '12px', color: 'var(--blue)', fontWeight: '500' }}>{techName}</span>
                  {isActive && team.length > 0 && (
                    <ReassignPicker job={job} team={team} onReassign={onReassign} />
                  )}
                </>
              ) : (
                <>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    border: '1.5px dashed var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: 'var(--text3)',
                  }}>?</div>
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Unassigned</span>
                  {isActive && team.length > 0 && (
                    <ReassignPicker job={job} team={team} onReassign={onReassign} />
                  )}
                  {isActive && team.length === 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--text3)', fontStyle: 'italic' }}>
                      — add team members to assign
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
            {job.price != null && (
              <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>
                ${Number(job.price).toFixed(2)}
              </span>
            )}
            {canComplete && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onMarkComplete(job)}
              >
                Mark complete
              </button>
            )}
            {job.status === 'completed' && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onCreateInvoice(job)}
                style={{ fontSize: '11px', color: 'var(--blue)' }}
              >
                + Invoice
              </button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── New job form ──────────────────────────────────────────────────────────────
function NewJobForm({ team, onCreated, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.job_description.trim()) {
      setError('Customer name and job description are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const created = await createJob({
        ...form,
        technician_id: form.technician_id || null,
        price: form.price ? parseFloat(form.price) : undefined,
        duration_hours: form.duration_hours ? parseFloat(form.duration_hours) : undefined,
      });
      onCreated(created);
    } catch (err) {
      setError(err.message || 'Failed to create job.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardHeader><CardTitle>New job</CardTitle></CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Customer name <span style={{ color: 'var(--red)' }}>*</span></label>
              <input value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="Jane Smith" />
            </div>
            <div className="field">
              <label>Customer phone</label>
              <input type="tel" value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} placeholder="+1 416 555 0100" />
            </div>
          </div>
          <div className="field">
            <label>Job description <span style={{ color: 'var(--red)' }}>*</span></label>
            <textarea value={form.job_description} onChange={e => set('job_description', e.target.value)} placeholder="Describe the work to be done..." rows={2} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Service type</label>
              <input value={form.service_type} onChange={e => set('service_type', e.target.value)} placeholder="e.g. HVAC repair" />
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, Toronto" />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Scheduled date</label>
              <input type="date" value={form.scheduled_date} onChange={e => set('scheduled_date', e.target.value)} />
            </div>
            <div className="field">
              <label>Scheduled time</label>
              <input type="time" value={form.scheduled_time} onChange={e => set('scheduled_time', e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Duration (hours)</label>
              <input type="number" min="0" step="0.5" value={form.duration_hours} onChange={e => set('duration_hours', e.target.value)} placeholder="2.5" />
            </div>
            <div className="field">
              <label>Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="250.00" />
            </div>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes..." rows={2} />
          </div>
          <div className="field">
            <label>Assign technician</label>
            {team.length > 0 ? (
              <select value={form.technician_id} onChange={e => set('technician_id', e.target.value)}>
                <option value="">— Unassigned —</option>
                {team.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}{m.title ? ` · ${m.title}` : ''}{m.role !== 'technician' ? ` (${m.role})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text3)', padding: '8px 0', fontStyle: 'italic' }}>
                No active team members — <a href="/app/team" style={{ color: 'var(--blue)' }}>add team members</a> to enable assignment
              </div>
            )}
          </div>
          {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn btn-dark" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create job'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

// ─── Main Jobs page ────────────────────────────────────────────────────────────
export function Jobs() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('today');
  const [techFilter, setTechFilter] = useState(null); // null=all, 'unassigned', or uuid
  const [jobs, setJobs] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchJobs().catch(() => []),
      fetchTeam().catch(() => []),
    ]).then(([jobData, teamData]) => {
      setJobs(Array.isArray(jobData) ? jobData : []);
      setTeam(Array.isArray(teamData) ? teamData.filter(m => m.is_active) : []);
    }).finally(() => setLoading(false));
  }, []);

  const today = todayStr();
  const endOfWeek = weekEnd();

  // Time filter
  const timeFiltered = jobs.filter(j => {
    if (tab === 'today') return j.scheduled_date === today;
    if (tab === 'week') return j.scheduled_date >= today && j.scheduled_date <= endOfWeek;
    return true;
  });

  // Tech filter applied on top of time filter
  const displayed = timeFiltered.filter(j => {
    if (techFilter === null) return true;
    if (techFilter === 'unassigned') return !j.technician_id && !j.technician_name;
    return j.technician_id === techFilter;
  });

  // Dispatch awareness counts (within time view)
  const unassignedCount = timeFiltered.filter(j =>
    !['completed', 'cancelled'].includes(j.status) && !j.technician_id && !j.technician_name
  ).length;

  // Per-technician counts for filter pills (within time view, active jobs only)
  const techCounts = {};
  timeFiltered.forEach(j => {
    if (j.technician_id && !['completed', 'cancelled'].includes(j.status)) {
      techCounts[j.technician_id] = (techCounts[j.technician_id] || 0) + 1;
    }
  });

  const handleCreateInvoice = (job) => {
    navigate(`/app/invoices?job=${job.id}`);
  };

  const handleMarkComplete = async (job) => {
    try {
      const result = await updateJob(job.id, { status: 'completed' });
      // /complete returns { job, invoicePrompt } but PATCH returns job directly
      const updated = result.job || result;
      setJobs(prev => prev.map(j => j.id === job.id ? updated : j));
    } catch (err) {
      console.error('Failed to update job:', err);
    }
  };

  const handleReassign = (updated) => {
    const job = updated.job || updated;
    setJobs(prev => prev.map(j => j.id === job.id ? job : j));
  };

  const handleCreated = (newJob) => {
    setJobs(prev => [newJob, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="page active jobs-page" id="p-jobs">
      <div>
        <section className="page-hero jobs-hero">
          <div>
            <div className="page-eyebrow">Operations</div>
            <h1 className="page-title">Schedule, assign, and finish work with less drag.</h1>
            <p className="page-subtitle">
              Keep dispatch clear, make assignment obvious, and move completed work cleanly into invoicing.
            </p>
          </div>
          <div className="page-stat-chip">
            <strong>{loading ? '—' : displayed.length}</strong>
            <span>{tab === 'today' ? 'jobs today' : tab === 'week' ? 'jobs this week' : 'jobs in view'}</span>
          </div>
        </section>

        {/* ── Header row ── */}
        <div className="toolbar-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[
              { key: 'today', label: 'Today' },
              { key: 'week',  label: 'This week' },
              { key: 'all',   label: 'All jobs' },
            ].map(t => (
              <button
                key={t.key}
                className={`fbtn${tab === t.key ? ' on' : ''}`}
                onClick={() => { setTab(t.key); setTechFilter(null); }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {!loading && team.length > 0 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/app/team')}
                style={{ fontSize: '12px', color: 'var(--text3)' }}
              >
                {team.length} active member{team.length !== 1 ? 's' : ''}
              </button>
            )}
            <button className="btn btn-dark btn-sm" onClick={() => setShowForm(v => !v)}>
              {showForm ? '✕ Cancel' : '+ New Job'}
            </button>
          </div>
        </div>

        {/* ── Dispatch alert: unassigned jobs warning ── */}
        {!loading && unassignedCount > 0 && techFilter !== 'unassigned' && (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 'var(--r)',
              padding: '10px 14px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
            onClick={() => setTechFilter('unassigned')}
          >
            <span style={{ color: '#92400e' }}>
              <strong>{unassignedCount} unassigned</strong> job{unassignedCount !== 1 ? 's' : ''} need a technician
            </span>
            <span style={{ fontSize: '11px', color: '#b45309', textDecoration: 'underline' }}>View →</span>
          </div>
        )}

        {/* ── Technician filter pills ── */}
        {!loading && team.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button
              className={`fbtn${techFilter === null ? ' on' : ''}`}
              onClick={() => setTechFilter(null)}
            >
              All
            </button>
            <button
              className={`fbtn${techFilter === 'unassigned' ? ' on' : ''}`}
              onClick={() => setTechFilter(techFilter === 'unassigned' ? null : 'unassigned')}
            >
              Unassigned
              {unassignedCount > 0 && (
                <span className="nb-badge" style={{ marginLeft: '5px', background: '#d97706' }}>
                  {unassignedCount}
                </span>
              )}
            </button>
            {team.map(m => (
              <button
                key={m.id}
                className={`fbtn${techFilter === m.id ? ' on' : ''}`}
                onClick={() => setTechFilter(techFilter === m.id ? null : m.id)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <TechBadge name={m.name} size={16} />
                  {m.name.split(' ')[0]}
                  {techCounts[m.id] != null && (
                    <span className="nb-badge" style={{ marginLeft: '3px' }}>{techCounts[m.id]}</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── New job form ── */}
        {showForm && (
          <NewJobForm
            team={team}
            onCreated={handleCreated}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* ── Job list ── */}
        {loading ? (
          <div className="loading">Loading…</div>
        ) : displayed.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.7 }}>
              {techFilter === 'unassigned'
                ? 'No unassigned jobs — all jobs have a technician assigned.'
                : techFilter
                  ? `No jobs assigned to ${team.find(m => m.id === techFilter)?.name || 'this technician'} in this period.`
                  : 'No jobs scheduled. Create a job or let estimates convert automatically.'}
            </div>
          </div>
        ) : (
          <div className="job-list-stack" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayed.map(job => (
              <JobCard
                key={job.id}
                job={job}
                team={team}
                onMarkComplete={handleMarkComplete}
                onReassign={handleReassign}
                onCreateInvoice={handleCreateInvoice}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
