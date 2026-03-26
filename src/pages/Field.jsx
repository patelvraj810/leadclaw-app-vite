import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, updateJob, completeJob, fetchTeam } from '../lib/api';
import { Tag } from '../components/ui/Tag';
import { PageHero } from '../components/ui/PageHero';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function fmtTime(t) {
  if (!t) return null;
  const [h, m] = t.slice(0, 5).split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function fmtDate(d) {
  if (!d) return null;
  // Use noon to avoid timezone edge cases
  return new Date(d + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

function mapsUrl(address) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}`;
}

function waUrl(phone) {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}

function techName(job) {
  return job.technician?.name || job.technician_name || null;
}

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  scheduled:   { color: 'gray',  label: 'Scheduled' },
  confirmed:   { color: 'blue',  label: 'Confirmed' },
  in_progress: { color: 'amber', label: 'In Progress' },
  completed:   { color: 'green', label: 'Completed' },
  cancelled:   { color: 'red',   label: 'Cancelled' },
};

// Next status in the field workflow
const NEXT_STATUS = {
  scheduled:   { status: 'confirmed',   label: 'Confirm job',   bg: 'var(--blue)' },
  confirmed:   { status: 'in_progress', label: 'Start job',     bg: 'var(--amber)' },
  in_progress: { status: 'complete',    label: 'Complete job',  bg: 'var(--green)' },
};

// ─── Default completion checklist ─────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { key: 'arrived',     label: 'Arrived on site' },
  { key: 'completed',   label: 'Work completed as described' },
  { key: 'site_clean',  label: 'Site cleaned up' },
  { key: 'cust_review', label: 'Customer reviewed the work' },
  { key: 'tools',       label: 'Tools and materials accounted for' },
];

function defaultChecklist() {
  return Object.fromEntries(CHECKLIST_ITEMS.map(i => [i.key, false]));
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, count, children, defaultCollapsed = false }) {
  const [open, setOpen] = useState(!defaultCollapsed);
  return (
    <div style={{ marginBottom: '24px' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 0 10px 0', width: '100%', textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: '11px', fontWeight: '700', color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: '.1em',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {title}
        </span>
        {count != null && (
          <span style={{
            fontSize: '11px', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace",
            background: 'var(--surface3)', color: 'var(--text2)',
            padding: '1px 7px', borderRadius: '20px',
          }}>
            {count}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text3)' }}>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && children}
    </div>
  );
}

// ─── Completion panel (inline, shown when tapping "Complete job") ──────────────
function CompletionPanel({ job, checklist, onChecklistChange, note, onNoteChange, onConfirm, onCancel, saving }) {
  const allChecked = CHECKLIST_ITEMS.every(i => checklist[i.key]);

  return (
    <div style={{
      marginTop: '16px', padding: '16px',
      background: 'var(--surface2)', borderRadius: 'var(--r)',
      border: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: 'var(--text)' }}>
        Complete job — {job.customer_name}
      </div>

      {/* Checklist */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '8px' }}>
          Completion checklist
        </div>
        {CHECKLIST_ITEMS.map(item => (
          <label
            key={item.key}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
              background: checklist[item.key] ? 'var(--green-bg)' : 'transparent',
              marginBottom: '4px',
            }}
          >
            <input
              type="checkbox"
              checked={!!checklist[item.key]}
              onChange={e => onChecklistChange(item.key, e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--green)', flexShrink: 0 }}
            />
            <span style={{
              fontSize: '13px',
              color: checklist[item.key] ? 'var(--green)' : 'var(--text2)',
              textDecoration: checklist[item.key] ? 'line-through' : 'none',
            }}>
              {item.label}
            </span>
          </label>
        ))}
      </div>

      {/* Visit / completion note */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)', display: 'block', marginBottom: '6px' }}>
          Visit summary <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(optional — saved with job)</span>
        </label>
        <textarea
          value={note}
          onChange={e => onNoteChange(e.target.value)}
          placeholder="Describe the work completed, any issues found, parts used, follow-up needed…"
          rows={3}
          style={{ fontSize: '13px', lineHeight: 1.6 }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onConfirm}
          disabled={saving || !allChecked}
          style={{
            flex: 1, padding: '12px',
            background: allChecked ? 'var(--green)' : 'var(--surface3)',
            color: allChecked ? '#fff' : 'var(--text3)',
            border: 'none', borderRadius: 'var(--r)',
            fontSize: '14px', fontWeight: '700', cursor: allChecked && !saving ? 'pointer' : 'not-allowed',
            transition: 'all .15s',
          }}
        >
          {saving ? 'Saving…' : allChecked ? '✓ Confirm complete' : `Check all items (${CHECKLIST_ITEMS.filter(i => checklist[i.key]).length}/${CHECKLIST_ITEMS.length})`}
        </button>
        <button onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Field job card ────────────────────────────────────────────────────────────
function FieldJobCard({ job, onUpdate }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [checklist, setChecklist] = useState(defaultChecklist);
  const [note, setNote] = useState(job.completion_note || '');
  const [savingNote, setSavingNote] = useState(false);
  const [actioning, setActioning] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [error, setError] = useState('');

  const cfg = STATUS_CFG[job.status] || { color: 'gray', label: job.status };
  const next = NEXT_STATUS[job.status];
  const isActive = !['completed', 'cancelled'].includes(job.status);
  const tech = techName(job);

  const handleStatusAction = async () => {
    if (!next) return;
    if (next.status === 'complete') {
      setExpanded(true);
      setCompleting(true);
      return;
    }
    setActioning(true);
    try {
      const updated = await updateJob(job.id, { status: next.status });
      onUpdate(updated);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setActioning(false);
    }
  };

  const handleComplete = async () => {
    setActioning(true);
    try {
      // Build completion note from checklist + manual note
      const checkedItems = CHECKLIST_ITEMS.filter(i => checklist[i.key]).map(i => `✓ ${i.label}`);
      const fullNote = [
        checkedItems.join('\n'),
        note.trim(),
      ].filter(Boolean).join('\n\n');

      const result = await completeJob(job.id, { completion_note: fullNote || undefined });
      onUpdate(result.job || result);
      setCompleting(false);
      setExpanded(false);
      setError('');
      if (result.invoicePrompt) setJustCompleted(true);
    } catch (err) {
      setError(err.message || 'Failed to complete job');
    } finally {
      setActioning(false);
    }
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      const updated = await updateJob(job.id, { completion_note: note });
      onUpdate(updated);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1.5px solid ${job.status === 'in_progress' ? 'var(--amber)' : job.status === 'confirmed' ? 'var(--blue)' : 'var(--border)'}`,
      borderRadius: 'var(--rl)',
      padding: '16px',
      marginBottom: '10px',
      boxShadow: job.status === 'in_progress' ? '0 2px 12px rgba(217,119,6,.12)' : '0 1px 4px rgba(0,0,0,.05)',
    }}>

      {/* Top row: name + status + price */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)' }}>
              {job.customer_name}
            </span>
            <Tag color={cfg.color} style={{ fontSize: '10px' }}>{cfg.label}</Tag>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.4 }}>
            {job.service_type || job.job_description}
          </div>
        </div>
        {job.price != null && (
          <span style={{
            fontSize: '16px', fontWeight: '700', flexShrink: 0,
            fontFamily: "'JetBrains Mono', monospace", color: 'var(--text)',
          }}>
            ${Number(job.price).toFixed(0)}
          </span>
        )}
      </div>

      {/* Meta row: time, address */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {job.scheduled_date && (
          <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
            🕐 {fmtDate(job.scheduled_date)}{job.scheduled_time ? ` · ${fmtTime(job.scheduled_time)}` : ''}
          </span>
        )}
        {job.duration_hours && (
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
            ~{job.duration_hours}h
          </span>
        )}
      </div>

      {job.address && (
        <a
          href={mapsUrl(job.address)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: 'var(--blue)', textDecoration: 'none',
            marginBottom: '10px', fontWeight: '500',
          }}
        >
          📍 {job.address}
          <span style={{ fontSize: '11px', color: 'var(--text3)' }}>→ Maps</span>
        </a>
      )}

      {/* Tech badge */}
      {tech && (
        <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '10px' }}>
          Assigned to <strong style={{ color: 'var(--text2)' }}>{tech}</strong>
        </div>
      )}

      {/* Customer contact row */}
      {(job.customer_phone || job.customer_email) && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {job.customer_phone && (
            <a
              href={`tel:${job.customer_phone}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '8px',
                background: 'var(--surface2)', border: '1px solid var(--border)',
                fontSize: '13px', fontWeight: '600', color: 'var(--text)',
                textDecoration: 'none',
              }}
            >
              📞 Call
            </a>
          )}
          {job.customer_phone && (
            <a
              href={waUrl(job.customer_phone)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '8px',
                background: 'var(--surface2)', border: '1px solid var(--border)',
                fontSize: '13px', fontWeight: '600', color: 'var(--text)',
                textDecoration: 'none',
              }}
            >
              💬 WhatsApp
            </a>
          )}
          {job.customer_email && (
            <a
              href={`mailto:${job.customer_email}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '8px 14px', borderRadius: '8px',
                background: 'var(--surface2)', border: '1px solid var(--border)',
                fontSize: '13px', fontWeight: '600', color: 'var(--text)',
                textDecoration: 'none',
              }}
            >
              ✉️ Email
            </a>
          )}
        </div>
      )}

      {/* Primary status action button */}
      {isActive && next && !completing && (
        <button
          onClick={handleStatusAction}
          disabled={actioning}
          style={{
            width: '100%', padding: '13px',
            background: next.bg, color: '#fff',
            border: 'none', borderRadius: 'var(--r)',
            fontSize: '14px', fontWeight: '700', cursor: 'pointer',
            marginBottom: '8px', transition: 'opacity .15s',
            opacity: actioning ? 0.7 : 1,
          }}
        >
          {actioning ? 'Updating…' : next.label}
        </button>
      )}

      {error ? <div className="form-error compact">{error}</div> : null}

      {/* Completion panel */}
      {completing && (
        <CompletionPanel
          job={job}
          checklist={checklist}
          onChecklistChange={(key, val) => setChecklist(c => ({ ...c, [key]: val }))}
          note={note}
          onNoteChange={setNote}
          onConfirm={handleComplete}
          onCancel={() => setCompleting(false)}
          saving={actioning}
        />
      )}

      {/* Invoice prompt — shown immediately after field completion */}
      {justCompleted && (
        <div style={{
          marginTop: '10px', padding: '12px 14px',
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 'var(--r)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <span style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>
            ✓ Job complete — ready to invoice {job.customer_name}?
          </span>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button
              className="btn btn-sm"
              style={{ background: 'var(--green)', color: '#fff', border: 'none', fontSize: '12px' }}
              onClick={() => navigate(`/app/invoices?job=${job.id}`)}
            >
              Create invoice
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '12px' }}
              onClick={() => setJustCompleted(false)}
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* Expand/collapse for details */}
      {!completing && (
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '12px', color: 'var(--text3)', padding: '2px 0', width: '100%',
            textAlign: 'left',
          }}
        >
          {expanded ? '▾ Hide details' : '▸ View details'}
        </button>
      )}

      {/* Expanded details */}
      {expanded && !completing && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          {/* Full job description if different from service type */}
          {job.job_description && job.job_description !== job.service_type && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '4px' }}>
                Description
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>
                {job.job_description}
              </div>
            </div>
          )}

          {/* Dispatcher notes */}
          {job.notes && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '4px' }}>
                Dispatcher notes
              </div>
              <div style={{
                fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6,
                padding: '10px 12px', background: 'var(--surface2)', borderRadius: '8px',
              }}>
                {job.notes}
              </div>
            </div>
          )}

          {/* Previous completion note if exists */}
          {job.completion_note && job.status === 'completed' && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '4px' }}>
                Completion summary
              </div>
              <div style={{
                fontSize: '12px', color: 'var(--text2)', lineHeight: 1.7,
                padding: '10px 12px', background: 'var(--green-bg)', borderRadius: '8px',
                whiteSpace: 'pre-wrap',
              }}>
                {job.completion_note}
              </div>
            </div>
          )}

          {/* Visit notes (only for active jobs) */}
          {isActive && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>
                Visit notes
              </div>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add notes about this visit — issues found, parts needed, next steps…"
                rows={3}
                style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '6px' }}
              />
              <button
                onClick={handleSaveNote}
                disabled={savingNote || note === (job.completion_note || '')}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '12px' }}
              >
                {savingNote ? 'Saving…' : 'Save notes'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Field page ───────────────────────────────────────────────────────────
export function Field() {
  const [jobs, setJobs] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [techFilter, setTechFilter] = useState(''); // '' = all, uuid = specific tech

  const today = todayStr();

  const load = useCallback(() => {
    Promise.all([fetchJobs(), fetchTeam()])
      .then(([jobsData, teamData]) => {
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setTeam((Array.isArray(teamData) ? teamData : []).filter(m => m.is_active));
      })
      .catch(err => console.error('Field load failed:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = (updated) => {
    setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
  };

  // Filter by technician if selected
  const filtered = techFilter
    ? jobs.filter(j => j.technician_id === techFilter)
    : jobs;

  // Bucket into today / upcoming / completed
  const todayJobs     = filtered.filter(j => j.scheduled_date === today && !['completed', 'cancelled'].includes(j.status));
  const upcomingJobs  = filtered.filter(j => j.scheduled_date > today && !['completed', 'cancelled'].includes(j.status));
  const noDateJobs    = filtered.filter(j => !j.scheduled_date && !['completed', 'cancelled'].includes(j.status));
  const completedJobs = filtered.filter(j => j.status === 'completed')
    .sort((a, b) => (b.completed_at || b.updated_at || '').localeCompare(a.completed_at || a.updated_at || ''))
    .slice(0, 15);

  const activeCount = todayJobs.length + upcomingJobs.length + noDateJobs.length;

  return (
    <div className="page active surface-page field-page" id="p-field">
      <PageHero
        className="field-hero"
        eyebrow="Technician workflow"
        title="Field"
        subtitle="Keep assigned work simple in the field with quick status updates, visit notes, and a clean path to invoicing."
        stat={{ value: String(activeCount), label: 'active jobs in view' }}
      />

      {/* Tech filter bar */}
      <div className="field-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <select
              value={techFilter}
              onChange={e => setTechFilter(e.target.value)}
              style={{ fontSize: '13px', fontWeight: '600', padding: '8px 10px' }}
            >
              <option value="">All field jobs</option>
              {team.map(m => (
                <option key={m.id} value={m.id}>{m.name}{m.title ? ` — ${m.title}` : ''}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text)', lineHeight: 1 }}>
                {todayJobs.length}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text3)' }}>today</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text2)', lineHeight: 1 }}>
                {upcomingJobs.length}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text3)' }}>upcoming</div>
            </div>
          </div>
          {team.length === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontStyle: 'italic' }}>
              Add team members to filter by technician
            </div>
          )}
        </div>
        {techFilter === '' && team.length > 0 && (
          <div className="field-toolbar-note">
            Viewing all jobs — select a technician above to filter to their view
          </div>
        )}
      </div>

      <div className="field-content">

        {loading ? (
          <div className="loading" style={{ padding: '40px 0' }}>Loading…</div>
        ) : activeCount === 0 && completedJobs.length === 0 ? (
          <div className="empty-state panel-empty">
            <div className="panel-empty-icon">📋</div>
            <div className="panel-empty-title">
              {techFilter ? 'No jobs assigned to this technician' : 'No active jobs'}
            </div>
            <div className="panel-empty-copy">
              {techFilter ? 'Assign jobs from the Jobs page.' : 'Create jobs from the Jobs page to see them here.'}
            </div>
          </div>
        ) : (
          <>
            {/* TODAY */}
            <Section title="Today" count={todayJobs.length}>
              {todayJobs.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--text3)', padding: '12px 0', fontStyle: 'italic' }}>
                  No jobs scheduled for today.
                </div>
              ) : (
                todayJobs.map(job => (
                  <FieldJobCard key={job.id} job={job} onUpdate={handleUpdate} />
                ))
              )}
            </Section>

            {/* UPCOMING */}
            <Section title="Upcoming" count={upcomingJobs.length}>
              {upcomingJobs.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--text3)', padding: '12px 0', fontStyle: 'italic' }}>
                  Nothing scheduled yet.
                </div>
              ) : (
                upcomingJobs.map(job => (
                  <FieldJobCard key={job.id} job={job} onUpdate={handleUpdate} />
                ))
              )}
            </Section>

            {/* UNSCHEDULED */}
            {noDateJobs.length > 0 && (
              <Section title="Unscheduled" count={noDateJobs.length} defaultCollapsed>
                {noDateJobs.map(job => (
                  <FieldJobCard key={job.id} job={job} onUpdate={handleUpdate} />
                ))}
              </Section>
            )}

            {/* COMPLETED */}
            {completedJobs.length > 0 && (
              <Section title="Recently completed" count={completedJobs.length} defaultCollapsed>
                {completedJobs.map(job => (
                  <FieldJobCard key={job.id} job={job} onUpdate={handleUpdate} />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
