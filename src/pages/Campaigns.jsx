import { useState, useEffect } from 'react';
import {
  fetchCampaigns, createCampaign, updateCampaign, deleteCampaign,
  activateCampaign, pauseCampaign,
  fetchCampaignRuns, triggerCampaign,
} from '../lib/api';
import { Tag } from '../components/ui/Tag';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';

// ─── Type configuration ───────────────────────────────────────────────────────
const TYPE_CONFIG = {
  review_request: {
    label: 'Review Request',
    icon: '⭐',
    color: 'amber',
    desc: 'Ask for a Google review after a job is completed.',
    triggerLabel: 'After job completed',
    defaultDelay: 24,
    defaultSegment: 'completed_jobs',
    defaultTrigger: 'job_completed',
    defaultTemplate:
      'Hi {{customer_name}}! Thanks so much for choosing {{business_name}} 🙏 We\'d love to hear your feedback — could you leave us a quick Google review? {{review_link}}\n\nIt only takes a minute and means the world to us!',
  },
  post_job: {
    label: 'Post-Job Follow-Up',
    icon: '✅',
    color: 'green',
    desc: 'Check in with the customer after a job is done to ensure satisfaction.',
    triggerLabel: 'After job completed',
    defaultDelay: 4,
    defaultSegment: 'completed_jobs',
    defaultTrigger: 'job_completed',
    defaultTemplate:
      'Hi {{customer_name}}, this is {{agent_name}} from {{business_name}}. Just checking in — how did everything go with your recent service? 😊\n\nLet us know if there\'s anything at all we can help with!',
  },
  quote_followup: {
    label: 'Quote Follow-Up',
    icon: '📋',
    color: 'blue',
    desc: 'Follow up on estimates that haven\'t received a response yet.',
    triggerLabel: 'Estimate sent, no response',
    defaultDelay: 48,
    defaultSegment: 'sent_estimates',
    defaultTrigger: 'estimate_sent',
    defaultTemplate:
      'Hi {{customer_name}}, I wanted to follow up on the estimate we sent you. Do you have any questions? We\'d love to get you booked in.\n\n— {{agent_name}} from {{business_name}}',
  },
  stale_lead: {
    label: 'Stale Lead Reactivation',
    icon: '🔁',
    color: 'gray',
    desc: 'Re-engage leads that went silent and haven\'t responded in a while.',
    triggerLabel: 'Lead gone silent',
    defaultDelay: 168,
    defaultSegment: 'unresponded',
    defaultTrigger: 'lead_stale',
    defaultTemplate:
      'Hey {{customer_name}}! 👋 Just following up from {{business_name}}. Are you still looking for help with your project?\n\nWe have availability this week — just reply and I\'ll get you sorted right away!',
  },
};

const SEGMENTS = [
  { key: 'all',            label: 'All leads' },
  { key: 'qualified',      label: 'Qualified leads only' },
  { key: 'unresponded',    label: 'Leads with no response' },
  { key: 'completed_jobs', label: 'Customers with completed jobs' },
  { key: 'sent_estimates', label: 'Leads with sent estimates' },
];

const CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { key: 'email',    label: 'Email',    icon: '✉️' },
  { key: 'sms',      label: 'SMS',      icon: '📱' },
];

const STATUS_CONFIG = {
  draft:   { color: 'gray',  label: 'Draft' },
  active:  { color: 'green', label: 'Active' },
  paused:  { color: 'amber', label: 'Paused' },
  archived:{ color: 'gray',  label: 'Archived' },
};

function delayLabel(hours) {
  if (hours < 24) return `${hours}h after trigger`;
  const days = Math.round(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} after trigger`;
}

function segmentLabel(key) {
  return SEGMENTS.find(s => s.key === key)?.label || key;
}

// ─── Empty form factory ───────────────────────────────────────────────────────
function emptyForm(typeKey = 'review_request') {
  const tc = TYPE_CONFIG[typeKey];
  return {
    name: '',
    type: typeKey,
    channel: 'whatsapp',
    status: 'draft',
    target_segment: tc.defaultSegment,
    message_template: tc.defaultTemplate,
    delay_hours: tc.defaultDelay,
    trigger_event: tc.defaultTrigger,
    notes: '',
  };
}

// ─── Campaign Form ────────────────────────────────────────────────────────────
function CampaignForm({ initial, onSave, onCancel }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(
    isEdit ? {
      name: initial.name || '',
      type: initial.type || 'review_request',
      channel: initial.channel || 'whatsapp',
      status: initial.status || 'draft',
      target_segment: initial.target_segment || 'all',
      message_template: initial.message_template || '',
      delay_hours: initial.delay_hours ?? 24,
      trigger_event: initial.trigger_event || '',
      notes: initial.notes || '',
    } : emptyForm()
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  // When type changes, refresh defaults for new campaigns
  const handleTypeChange = (newType) => {
    const tc = TYPE_CONFIG[newType];
    if (!isEdit) {
      setForm(f => ({
        ...f,
        type: newType,
        target_segment: tc.defaultSegment,
        message_template: tc.defaultTemplate,
        delay_hours: tc.defaultDelay,
        trigger_event: tc.defaultTrigger,
      }));
    } else {
      set('type', newType);
    }
  };

  const handleSubmit = async (e, activateOnSave = false) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Campaign name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        delay_hours: Number(form.delay_hours) || 24,
        status: activateOnSave ? 'active' : form.status,
        notes: form.notes || undefined,
        trigger_event: form.trigger_event || undefined,
      };
      let result;
      if (isEdit) {
        result = await updateCampaign(initial.id, payload);
      } else {
        result = await createCampaign(payload);
      }
      onSave(result, isEdit);
    } catch (err) {
      setError(err.message || 'Failed to save campaign.');
    } finally {
      setSaving(false);
    }
  };

  const tc = TYPE_CONFIG[form.type] || TYPE_CONFIG.review_request;

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div className="field">
        <label>Campaign name <span style={{ color: 'var(--red)' }}>*</span></label>
        <input
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. Post-job review request"
        />
      </div>

      {/* Type */}
      <div className="field">
        <label>Campaign type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTypeChange(key)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '12px', borderRadius: 'var(--r)', textAlign: 'left',
                border: `1.5px solid ${form.type === key ? 'var(--text)' : 'var(--border)'}`,
                background: form.type === key ? 'var(--surface3)' : 'var(--surface)',
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>{cfg.icon}</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '2px' }}>{cfg.label}</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.4 }}>{cfg.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Channel + Segment row */}
      <div className="field-row">
        <div className="field">
          <label>Channel</label>
          <select value={form.channel} onChange={e => set('channel', e.target.value)}>
            {CHANNELS.map(c => (
              <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Target segment</label>
          <select value={form.target_segment} onChange={e => set('target_segment', e.target.value)}>
            {SEGMENTS.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Delay */}
      <div className="field">
        <label>
          Send delay
          <span style={{ fontWeight: 400, color: 'var(--text3)', marginLeft: '6px', fontSize: '11px' }}>
            (hours after trigger: {tc.triggerLabel.toLowerCase()})
          </span>
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            min="1"
            max="720"
            value={form.delay_hours}
            onChange={e => set('delay_hours', e.target.value)}
            style={{ width: '90px' }}
          />
          <span style={{ fontSize: '13px', color: 'var(--text3)' }}>hours</span>
          <span style={{ fontSize: '12px', color: 'var(--text2)', fontFamily: "'JetBrains Mono', monospace" }}>
            = {delayLabel(Number(form.delay_hours) || 24)}
          </span>
        </div>
      </div>

      {/* Message template */}
      <div className="field">
        <label>
          Message template
          <span style={{ fontWeight: 400, color: 'var(--text3)', marginLeft: '6px', fontSize: '11px' }}>
            variables: {'{{customer_name}}'}, {'{{business_name}}'}, {'{{agent_name}}'}, {'{{review_link}}'}
          </span>
        </label>
        <textarea
          value={form.message_template}
          onChange={e => set('message_template', e.target.value)}
          placeholder="Hi {{customer_name}}, …"
          rows={5}
          style={{ fontFamily: 'inherit', fontSize: '13px', lineHeight: 1.6 }}
        />
      </div>

      {/* Notes */}
      <div className="field" style={{ marginBottom: '20px' }}>
        <label>Notes <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(internal only)</span></label>
        <input
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Any notes about this campaign…"
        />
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button type="submit" className="btn btn-dark" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save as draft'}
        </button>
        {!isEdit && (
          <button
            type="button"
            className="btn btn-dark"
            style={{ background: 'var(--green)', borderColor: 'var(--green)' }}
            disabled={saving}
            onClick={e => handleSubmit(e, true)}
          >
            {saving ? 'Saving…' : 'Save & Activate'}
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ─── Campaign Card ────────────────────────────────────────────────────────────
function fmtRunDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d) / (1000 * 60));
  if (diff < 60)  return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

function CampaignCard({ campaign, onEdit, onToggle, onDelete }) {
  const [toggling,   setToggling]   = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [showRuns,   setShowRuns]   = useState(false);
  const [runs,       setRuns]       = useState(null);
  const [runsLoading, setRunsLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState(null);

  const tc = TYPE_CONFIG[campaign.type] || TYPE_CONFIG.review_request;
  const sc = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.draft;
  const ch = CHANNELS.find(c => c.key === campaign.channel) || CHANNELS[0];
  const canToggle = ['active', 'paused', 'draft'].includes(campaign.status);

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggle(campaign); } finally { setToggling(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${campaign.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try { await onDelete(campaign.id); } finally { setDeleting(false); }
  };

  const handleShowRuns = async () => {
    const next = !showRuns;
    setShowRuns(next);
    if (next && runs === null) {
      setRunsLoading(true);
      try {
        const data = await fetchCampaignRuns(campaign.id, { limit: 20 });
        setRuns(Array.isArray(data) ? data : []);
      } catch {
        setRuns([]);
      } finally {
        setRunsLoading(false);
      }
    }
  };

  const handleTrigger = async () => {
    const phone = window.prompt('Enter recipient phone number (+1…) to test-fire this campaign:');
    if (!phone) return;
    setTriggering(true);
    setTriggerResult(null);
    try {
      const result = await triggerCampaign(campaign.id, { recipient_phone: phone });
      setTriggerResult({ ok: true, status: result.status, msg: result.message?.slice(0, 80) });
      // Refresh runs
      setRuns(null);
      setShowRuns(false);
    } catch (err) {
      setTriggerResult({ ok: false, msg: err.message });
    } finally {
      setTriggering(false);
    }
  };

  const runCount = campaign.run_count || 0;
  const lastRun  = campaign.last_run_at ? fmtRunDate(campaign.last_run_at) : null;

  return (
    <Card>
      <CardBody>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
            background: 'var(--surface2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
          }}>
            {tc.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{campaign.name}</span>
              <Tag color={sc.color} style={{ fontSize: '10px' }}>{sc.label}</Tag>
              <Tag color={tc.color} style={{ fontSize: '10px' }}>{tc.label}</Tag>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--text3)', marginBottom: '6px' }}>
              <span>{ch.icon} {ch.label}</span>
              <span>→ {segmentLabel(campaign.target_segment)}</span>
              <span>⏱ {delayLabel(campaign.delay_hours)}</span>
              {runCount > 0 && (
                <span style={{ color: 'var(--text2)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {runCount} run{runCount !== 1 ? 's' : ''}
                  {lastRun ? ` · last ${lastRun}` : ''}
                </span>
              )}
              {runCount === 0 && campaign.status === 'active' && (
                <span style={{ color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                  no runs yet
                </span>
              )}
            </div>

            {campaign.message_template && (
              <div style={{
                fontSize: '12px', color: 'var(--text3)', fontStyle: 'italic',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: '420px',
              }}>
                "{campaign.message_template.slice(0, 100)}{campaign.message_template.length > 100 ? '…' : ''}"
              </div>
            )}

            {/* Trigger result feedback */}
            {triggerResult && (
              <div style={{
                marginTop: '8px', fontSize: '12px', padding: '6px 10px', borderRadius: '6px',
                background: triggerResult.ok ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                color: triggerResult.ok ? 'var(--green)' : 'var(--red)',
              }}>
                {triggerResult.ok ? `✓ Sent (${triggerResult.status})` : `✗ ${triggerResult.msg}`}
                {triggerResult.ok && triggerResult.msg && (
                  <div style={{ color: 'var(--text3)', marginTop: '2px' }}>"{triggerResult.msg}…"</div>
                )}
              </div>
            )}

            {/* Runs panel */}
            {showRuns && (
              <div style={{ marginTop: '12px' }}>
                {runsLoading ? (
                  <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Loading runs…</div>
                ) : !runs || runs.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text3)' }}>No execution history yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {runs.map(run => (
                      <div key={run.id} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px',
                        padding: '5px 8px', background: 'var(--surface2)', borderRadius: '6px',
                        flexWrap: 'wrap',
                      }}>
                        <Tag color={run.status === 'sent' ? 'green' : run.status === 'failed' ? 'red' : 'gray'} style={{ fontSize: '9px' }}>
                          {run.status}
                        </Tag>
                        <span style={{ color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                          {run.trigger_type}
                        </span>
                        <span style={{ color: 'var(--text3)' }}>
                          {run.recipient_phone || run.recipient_email || '—'}
                        </span>
                        <span style={{ color: 'var(--text3)', marginLeft: 'auto' }}>
                          {fmtRunDate(run.triggered_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {runCount > 0 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleShowRuns}
                style={{ fontSize: '11px', color: 'var(--text3)' }}
              >
                {showRuns ? 'Hide runs' : `${runCount} run${runCount !== 1 ? 's' : ''}`}
              </button>
            )}
            {campaign.status !== 'archived' && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleTrigger}
                disabled={triggering}
                style={{ fontSize: '11px', color: 'var(--blue)' }}
                title="Manually test-fire this campaign for a specific recipient"
              >
                {triggering ? '…' : 'Test fire'}
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => onEdit(campaign)}>Edit</button>
            {canToggle && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleToggle}
                disabled={toggling}
                style={{ color: campaign.status === 'active' ? 'var(--amber)' : 'var(--green)' }}
              >
                {toggling ? '…' : campaign.status === 'active' ? 'Pause' : 'Activate'}
              </button>
            )}
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleDelete}
              disabled={deleting}
              style={{ color: 'var(--red)' }}
            >
              {deleting ? '…' : 'Delete'}
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Main Campaigns page ──────────────────────────────────────────────────────
export function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'new' | 'edit'
  const [editing, setEditing] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCampaigns()
      .then(data => setCampaigns(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to load campaigns:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (campaign, isEdit) => {
    if (isEdit) {
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
    } else {
      setCampaigns(prev => [campaign, ...prev]);
    }
    setEditing(null);
    setView('list');
  };

  const handleEdit = (campaign) => {
    setEditing(campaign);
    setView('edit');
  };

  const handleToggle = async (campaign) => {
    let updated;
    if (campaign.status === 'active') {
      updated = await pauseCampaign(campaign.id);
    } else {
      updated = await activateCampaign(campaign.id);
    }
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDelete = async (id) => {
    await deleteCampaign(id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // Derived stats
  const active  = campaigns.filter(c => c.status === 'active');
  const paused  = campaigns.filter(c => c.status === 'paused');
  const drafts  = campaigns.filter(c => c.status === 'draft');

  const displayed = filterStatus === 'all'
    ? campaigns.filter(c => c.status !== 'archived')
    : campaigns.filter(c => c.status === filterStatus);

  return (
    <div className="page active" id="p-camp">
      <PageHero eyebrow="Growth" title="Campaigns" subtitle="Build outreach sequences that follow up with leads automatically." />
      <div>

        {/* ── Form view ── */}
        {(view === 'new' || view === 'edit') && (
          <>
            <button
              onClick={() => { setView('list'); setEditing(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text3)', marginBottom: '16px', padding: 0 }}
            >
              ← Campaigns
            </button>
            <Card>
              <CardHeader>
                <CardTitle>{view === 'edit' ? `Edit: ${editing?.name}` : 'New campaign'}</CardTitle>
              </CardHeader>
              <CardBody>
                <CampaignForm
                  initial={view === 'edit' ? editing : null}
                  onSave={handleSave}
                  onCancel={() => { setView('list'); setEditing(null); }}
                />
              </CardBody>
            </Card>
          </>
        )}

        {/* ── List view ── */}
        {view === 'list' && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                {campaigns.length > 0 && (
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Total', value: campaigns.filter(c => c.status !== 'archived').length },
                      { label: 'Active', value: active.length, color: 'var(--green)' },
                      { label: 'Paused', value: paused.length, color: 'var(--amber)' },
                      { label: 'Drafts', value: drafts.length },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif", color: s.color || 'var(--text)' }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="btn btn-dark btn-sm"
                onClick={() => { setEditing(null); setView('new'); }}
              >
                + New campaign
              </button>
            </div>

            {/* Filter pills */}
            {campaigns.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {[
                  { key: 'all',    label: 'All' },
                  { key: 'active', label: `Active (${active.length})` },
                  { key: 'paused', label: `Paused (${paused.length})` },
                  { key: 'draft',  label: `Drafts (${drafts.length})` },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilterStatus(f.key)}
                    style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      background: filterStatus === f.key ? 'var(--text)' : 'var(--surface)',
                      color: filterStatus === f.key ? '#fff' : 'var(--text2)',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* List */}
            {loading ? (
              <div className="loading">Loading…</div>
            ) : campaigns.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '45vh', gap: '12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '36px' }}>📣</div>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>No campaigns yet</div>
                <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '360px', lineHeight: 1.7 }}>
                  Create a campaign to automate follow-up messages. Your AI agent handles all the sends — review requests, quote nudges, and re-engagement run on autopilot.
                </div>
                <button
                  className="btn btn-dark"
                  style={{ marginTop: '8px' }}
                  onClick={() => { setEditing(null); setView('new'); }}
                >
                  Create first campaign
                </button>
              </div>
            ) : displayed.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '13px' }}>
                No campaigns with status "{filterStatus}".
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {displayed.map(campaign => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={handleEdit}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {/* Automation note */}
            {campaigns.length > 0 && (
              <div style={{
                marginTop: '24px', padding: '14px 16px',
                background: 'var(--surface2)', borderRadius: 'var(--r)',
                fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6,
              }}>
                <strong style={{ color: 'var(--text2)' }}>Note:</strong> Active campaigns queue messages automatically based on their trigger and delay. Actual delivery requires WhatsApp, email, or SMS to be configured in your channels settings.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
