import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchEstimates, createEstimate, updateEstimate,
  sendEstimate, approveEstimate, declineEstimate,
  markDepositPaid, convertEstimateToJob,
  fetchPricebook, fetchLeads, fetchTeam,
} from '../lib/api';
import { LineItemsEditor } from '../components/LineItemsEditor';
import { createLineItem } from '../lib/lineItems';
import { Tag } from '../components/ui/Tag';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { ModalShell } from '../components/ui/ModalShell';
import { PageHero } from '../components/ui/PageHero';

// ─── Status configuration ────────────────────────────────────────────────────
const STATUS = {
  draft:        { color: 'gray',   label: 'Draft' },
  sent:         { color: 'blue',   label: 'Sent' },
  approved:     { color: 'green',  label: 'Approved' },
  declined:     { color: 'red',    label: 'Declined' },
  expired:      { color: 'amber',  label: 'Expired' },
  deposit_paid: { color: 'green',  label: 'Deposit Paid' },
  converted:    { color: 'blue',   label: 'Converted' },
};

const TAX_RATE = 0.13;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtMoney(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

function calcTotals(items) {
  const subtotal = items.reduce((s, i) => s + Number(i.quantity || 1) * Number(i.unit_price || 0), 0);
  const tax_amount = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax_amount) * 100) / 100;
  return { subtotal: Math.round(subtotal * 100) / 100, tax_amount, total };
}

// ─── Estimate Form (create / edit) ────────────────────────────────────────────
function EstimateForm({ initialData, leads, pricebook, onSave, onCancel }) {
  const prefill = initialData || {};

  const [customerName, setCustomerName] = useState(prefill.customer_name || '');
  const [customerPhone, setCustomerPhone] = useState(prefill.customer_phone || '');
  const [customerEmail, setCustomerEmail] = useState(prefill.customer_email || '');
  const [leadId, setLeadId] = useState(prefill.lead_id || '');
  const [lineItems, setLineItems] = useState(
    (prefill.line_items?.length ? prefill.line_items : [createLineItem()]).map(i => ({ ...i, _key: Math.random().toString(36).slice(2) }))
  );
  const [depositAmount, setDepositAmount] = useState(prefill.deposit_amount != null ? String(prefill.deposit_amount) : '');
  const [expiresAt, setExpiresAt] = useState(prefill.expires_at ? prefill.expires_at.slice(0, 10) : '');
  const [notes, setNotes] = useState(prefill.notes || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isEdit = !!prefill.id;

  // Pre-fill customer from selected lead
  const handleLeadChange = (e) => {
    const id = e.target.value;
    setLeadId(id);
    if (id) {
      const lead = leads.find(l => l.id === id);
      if (lead) {
        if (!customerName) setCustomerName(lead.contact_name || '');
        if (!customerPhone) setCustomerPhone(lead.contact_phone || '');
        if (!customerEmail) setCustomerEmail(lead.contact_email || '');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) { setError('Customer name is required.'); return; }
    if (lineItems.length === 0) { setError('Add at least one line item.'); return; }

    const { subtotal, tax_amount, total } = calcTotals(lineItems);

    // Deposit validation
    const depositVal = depositAmount !== '' ? parseFloat(depositAmount) : null;
    if (depositVal !== null) {
      if (isNaN(depositVal) || depositVal < 0) {
        setError('Deposit amount cannot be negative.');
        return;
      }
      if (depositVal > total) {
        setError(`Deposit ($${depositVal.toFixed(2)}) cannot exceed the estimate total ($${total.toFixed(2)}).`);
        return;
      }
    }

    setError('');
    setSaving(true);

    // Strip _key before sending to backend
    // eslint-disable-next-line no-unused-vars
    const cleanItems = lineItems.map(({ _key, ...rest }) => rest);

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone || null,
      customer_email: customerEmail || null,
      lead_id: leadId || null,
      line_items: cleanItems,
      subtotal,
      tax_rate: TAX_RATE,
      tax_amount,
      total,
      deposit_amount: depositVal,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      notes: notes || null,
    };

    try {
      let result;
      if (isEdit) {
        result = await updateEstimate(prefill.id, payload);
      } else {
        result = await createEstimate(payload);
      }
      onSave(result, isEdit);
    } catch (err) {
      setError(err.message || 'Failed to save estimate.');
    } finally {
      setSaving(false);
    }
  };

  const { subtotal, tax_amount, total } = calcTotals(lineItems);

  return (
    <form onSubmit={handleSubmit} className="entity-form">
      <div className="form-section">
        <div className="form-section-head">
          <div className="form-section-title">Customer details</div>
          <div className="form-section-copy">Use the same clean information structure that appears on invoices and public estimate links.</div>
        </div>
        {leads.length > 0 && !isEdit && (
          <div className="field">
            <label>Pull from existing lead</label>
            <select value={leadId} onChange={handleLeadChange}>
              <option value="">Select a lead (optional)</option>
              {leads.slice(0, 40).map(l => (
                <option key={l.id} value={l.id}>{l.contact_name || 'Unknown'} — {l.source || 'web'}</option>
              ))}
            </select>
          </div>
        )}
        <div className="field-row">
          <div className="field">
            <label>Customer name <span className="field-required">*</span></label>
            <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jane Smith" />
          </div>
          <div className="field">
            <label>Phone</label>
            <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+1 416 555 0100" />
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="jane@example.com" />
        </div>
      </div>

      {/* Line items */}
      <div className="form-section">
        <div className="form-section-head">
          <div className="form-section-title">Line items</div>
          <div className="form-section-copy">Keep the estimate structure familiar so it naturally flows into invoicing later.</div>
        </div>
        <LineItemsEditor
          items={lineItems}
          onChange={setLineItems}
          pricebook={pricebook}
          quantityMin="0.25"
          quantityStep="0.25"
          customLabel="+ Custom line"
        />
      </div>

      <div className="form-section">
        <div className="field-row field-row-tight">
        <div className="field">
          <label>Deposit required ($)</label>
          <input
            type="number" min="0" step="0.01"
            value={depositAmount}
            onChange={e => setDepositAmount(e.target.value)}
            placeholder="0.00 (optional)"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
          {depositAmount !== '' && total > 0 && (() => {
            const dep = parseFloat(depositAmount);
            if (!isNaN(dep) && dep >= 0 && dep <= total) {
              return <div className="field-hint">{Math.round((dep / total) * 100)}% of total</div>;
            }
            if (!isNaN(dep) && dep > total) {
              return <div className="field-hint field-hint-error">Cannot exceed total ({fmtMoney(total)})</div>;
            }
            return null;
          })()}
        </div>
        <div className="field">
          <label>Expires on</label>
          <input
            type="date"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>
      </div>

      {lineItems.length > 0 && (
        <div className="summary-panel">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{fmtMoney(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>{fmtMoney(tax_amount)}</span>
          </div>
          {depositAmount ? (
            <div className="summary-row summary-row-accent">
              <span>Deposit</span>
              <span>{fmtMoney(depositAmount)}</span>
            </div>
          ) : null}
          <div className="summary-row emphatic">
            <span>Total</span>
            <span>{fmtMoney(total)}</span>
          </div>
        </div>
      )}

      <div className="form-section">
      <div className="field">
        <label>Internal notes <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(not shown to customer)</span></label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes for your team…"
          rows={2}
        />
      </div>
      </div>

      <div className="feature-hint disabled">
        <div>
          <div className="feature-hint-title">Generate with AI</div>
          <div className="feature-hint-copy">Auto-draft from conversation context. This stays visible as a clear next-step hook without pretending the feature is live.</div>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" disabled title="Coming soon">
          Draft from conversation
        </button>
      </div>

      {error ? <div className="form-error">{error}</div> : null}

      <div className="form-actions">
        <button type="submit" className="btn btn-dark" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create estimate'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ─── Convert to Job modal ─────────────────────────────────────────────────────
function ConvertModal({ estimate, onConvert, onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [techId, setTechId] = useState('');
  const [team, setTeam] = useState([]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeam()
      .then(data => setTeam((Array.isArray(data) ? data : []).filter(m => m.is_active)))
      .catch(() => {});
  }, []);

  const handleConvert = async () => {
    setConverting(true);
    setError('');
    try {
      const result = await convertEstimateToJob(estimate.id, {
        scheduled_date: date || undefined,
        scheduled_time: time || undefined,
        address: address || undefined,
        technician_id: techId || undefined,
      });
      onConvert(result);
    } catch (err) {
      setError(err.message || 'Conversion failed.');
      setConverting(false);
    }
  };

  return (
    <ModalShell
      title="Convert to job"
      subtitle={`Create a scheduled job for ${estimate.customer_name} worth ${fmtMoney(estimate.total)}.`}
      onClose={onClose}
      maxWidth={520}
    >
      <div className="entity-form">
        <div className="field-row">
          <div className="field">
            <label>Scheduled date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
          </div>
          <div className="field">
            <label>Scheduled time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Toronto" />
        </div>
        {team.length > 0 && (
          <div className="field" style={{ marginBottom: '20px' }}>
            <label>Assign technician <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(optional)</span></label>
            <select value={techId} onChange={e => setTechId(e.target.value)}>
              <option value="">Unassigned</option>
              {team.map(m => (
                <option key={m.id} value={m.id}>{m.name}{m.title ? ` — ${m.title}` : ''}</option>
              ))}
            </select>
          </div>
        )}

        {error ? <div className="form-error">{error}</div> : null}

        <div className="form-actions">
          <button className="btn btn-dark" onClick={handleConvert} disabled={converting}>
            {converting ? 'Creating job…' : 'Create job'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Estimate Detail view ─────────────────────────────────────────────────────
function EstimateDetail({ estimate, onUpdate, onEdit, onClose }) {
  const [acting, setAct] = useState(null);
  const [pendingConfirm, setPendingConfirm] = useState(null); // { fn, label } — for destructive actions
  const [showConvert, setShowConvert] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const statusCfg = STATUS[estimate.status] || { color: 'gray', label: estimate.status };
  const customerLink = estimate.public_token ? `${window.location.origin}/estimate/${estimate.public_token}` : null;

  const runAction = async (fn, label) => {
    setAct(label);
    setError('');
    try {
      const updated = await fn(estimate.id);
      onUpdate(updated);
    } catch (err) {
      setError(err.message || `${label} failed`);
    } finally {
      setAct(null);
    }
  };

  // For positive actions, run directly. For destructive ones, ask inline.
  const action = (fn, label, needsConfirm = false) => {
    if (needsConfirm) {
      setPendingConfirm({ fn, label });
    } else {
      runAction(fn, label);
    }
  };

  const handleConverted = ({ estimate: updated }) => {
    onUpdate(updated);
    setShowConvert(false);
    navigate(`/app/jobs`);
  };

  const handleCopyLink = async () => {
    if (!customerLink) return;
    try {
      await navigator.clipboard.writeText(customerLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const canEdit = ['draft', 'sent'].includes(estimate.status);
  const canSend = estimate.status === 'draft';
  const canResend = estimate.status === 'sent';
  const canApprove = estimate.status === 'sent';
  const canDecline = estimate.status === 'sent';
  const canDeposit = estimate.status === 'approved' && !!estimate.deposit_amount;
  const canConvert = ['approved', 'deposit_paid'].includes(estimate.status);

  return (
    <>
      {showConvert && (
        <ConvertModal
          estimate={estimate}
          onConvert={handleConverted}
          onClose={() => setShowConvert(false)}
        />
      )}

      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div>
            <button onClick={onClose} className="back-link" style={{ marginBottom: '8px' }}>
              ← All estimates
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>
                {estimate.customer_name}
              </h2>
              <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>
              Created {fmtDate(estimate.created_at)}
              {estimate.expires_at && ` · Expires ${fmtDate(estimate.expires_at)}`}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {canEdit && <button className="btn btn-ghost btn-sm" onClick={onEdit} disabled={!!acting}>Edit</button>}
            {canSend && (
              <button
                className="btn btn-dark btn-sm"
                disabled={!!acting}
                onClick={() => action(sendEstimate, 'Send')}
              >
                {acting === 'Send' ? 'Sending…' : 'Send estimate'}
              </button>
            )}
            {canResend && (
              <button
                className="btn btn-ghost btn-sm"
                disabled={!!acting}
                onClick={() => action(sendEstimate, 'Resend')}
                title="Re-send estimate link to customer"
              >
                {acting === 'Resend' ? 'Sending…' : 'Resend'}
              </button>
            )}
            {canApprove && (
              <button className="btn btn-dark btn-sm" style={{ background: 'var(--green)', borderColor: 'var(--green)' }} disabled={!!acting} onClick={() => action(approveEstimate, 'Approve')}>
                {acting === 'Approve' ? '…' : 'Approve'}
              </button>
            )}
            {canDecline && !pendingConfirm && (
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', borderColor: '#fecaca' }} disabled={!!acting} onClick={() => action(declineEstimate, 'Decline', true)}>
                Decline
              </button>
            )}
            {canDeposit && (
              <button className="btn btn-dark btn-sm" disabled={!!acting} onClick={() => action(markDepositPaid, 'Mark deposit paid')}>
                {acting === 'Mark deposit paid' ? '…' : 'Deposit received'}
              </button>
            )}
            {canConvert && (
              <button className="btn btn-dark btn-sm" onClick={() => setShowConvert(true)} disabled={!!acting}>
                Convert to job →
              </button>
            )}
            {estimate.status === 'converted' && estimate.converted_job_id && (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/jobs')}>
                View job →
              </button>
            )}
          </div>
        </div>

        {/* Inline decline confirmation */}
        {pendingConfirm && (
          <div style={{
            marginBottom: '14px',
            background: '#fff5f5',
            border: '1px solid #fecaca',
            borderRadius: 'var(--r)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--red)', flex: 1 }}>
              Decline this estimate? The customer will need to be contacted separately.
            </span>
            <button
              className="btn btn-sm"
              style={{ background: 'var(--red)', color: '#fff', border: 'none' }}
              disabled={!!acting}
              onClick={() => { runAction(pendingConfirm.fn, pendingConfirm.label); setPendingConfirm(null); }}
            >
              {acting === 'Decline' ? 'Declining…' : 'Yes, decline'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setPendingConfirm(null)}>
              Cancel
            </button>
          </div>
        )}

        {error ? <div className="form-error" style={{ marginBottom: '14px' }}>{error}</div> : null}

        {/* Customer info */}
        <div className="field-row" style={{ marginBottom: '16px' }}>
          {estimate.customer_phone && (
            <div style={{ fontSize: '13px' }}>
              <span style={{ color: 'var(--text3)' }}>Phone </span>
              <a href={`tel:${estimate.customer_phone}`} style={{ color: 'var(--text)', textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace" }}>
                {estimate.customer_phone}
              </a>
            </div>
          )}
          {estimate.customer_email && (
            <div style={{ fontSize: '13px' }}>
              <span style={{ color: 'var(--text3)' }}>Email </span>
              <a href={`mailto:${estimate.customer_email}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                {estimate.customer_email}
              </a>
            </div>
          )}
        </div>

        {/* Line items */}
        <Card style={{ marginBottom: '16px' }}>
          <CardHeader><CardTitle>Line items</CardTitle></CardHeader>
          <CardBody>
            {(estimate.line_items || []).length === 0 ? (
              <div style={{ color: 'var(--text3)', fontSize: '13px' }}>No line items.</div>
            ) : (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 70px 100px 90px',
                  gap: '8px',
                  padding: '0 0 8px',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text3)',
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}>
                  <span>Item</span>
                  <span style={{ textAlign: 'center' }}>Qty</span>
                  <span style={{ textAlign: 'right' }}>Unit price</span>
                  <span style={{ textAlign: 'right' }}>Total</span>
                </div>
                {(estimate.line_items || []).map((item, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 70px 100px 90px',
                    gap: '8px',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--surface3)',
                    fontSize: '13px',
                    alignItems: 'start',
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                      {item.description && <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{item.description}</div>}
                    </div>
                    <div style={{ textAlign: 'center', color: 'var(--text2)' }}>
                      {item.quantity} {item.unit || 'each'}
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>
                      {fmtMoney(item.unit_price)}
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>
                      {fmtMoney(item.total)}
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '32px', fontSize: '13px', color: 'var(--text2)' }}>
                    <span>Subtotal</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(estimate.subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '32px', fontSize: '13px', color: 'var(--text2)' }}>
                    <span>HST (13%)</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(estimate.tax_amount)}</span>
                  </div>
                  {estimate.deposit_amount != null && (
                    <div style={{ display: 'flex', gap: '32px', fontSize: '13px', color: 'var(--green)', fontWeight: '600' }}>
                      <span>Deposit required</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(estimate.deposit_amount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '32px', fontSize: '16px', fontWeight: '700', marginTop: '4px' }}>
                    <span>Total</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(estimate.total)}</span>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        {/* Status timeline */}
        <Card style={{ marginBottom: '16px' }}>
          <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              {[
                { label: 'Created', date: estimate.created_at },
                { label: 'Sent', date: estimate.sent_at },
                { label: 'Approved', date: estimate.approved_at },
                { label: 'Declined', date: estimate.declined_at },
                { label: 'Deposit paid', date: estimate.deposit_paid_at },
              ].map(({ label, date }) => date && (
                <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text2)' }}>{label}</span>
                  <span style={{ color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{fmtDate(date)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Notes */}
        {estimate.notes && (
          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardBody>
              <p style={{ fontSize: '13px', color: 'var(--text2)', whiteSpace: 'pre-wrap', margin: 0 }}>{estimate.notes}</p>
            </CardBody>
          </Card>
        )}

        {/* Customer link / send info */}
        {customerLink && ['sent', 'approved', 'deposit_paid', 'converted'].includes(estimate.status) && (
          <div style={{
            marginTop: '16px',
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: 'var(--r)',
            padding: '12px 14px',
            fontSize: '13px',
            color: '#0f4c81',
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Customer link</strong> — share this link for approval and deposit payment.
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <code style={{
                background: 'rgba(255,255,255,.72)',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#075985',
                wordBreak: 'break-all',
              }}>
                {customerLink}
              </code>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleCopyLink}>
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            {estimate.status === 'sent' && (
              <div style={{ marginTop: '8px' }}>
                If WhatsApp is configured, the customer received this estimate automatically. Otherwise, send the link manually.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Estimate Card (list item) ────────────────────────────────────────────────
function EstimateCard({ est, onClick }) {
  const statusCfg = STATUS[est.status] || { color: 'gray', label: est.status };
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '14px 16px',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r)',
        background: 'var(--surface)',
        cursor: 'pointer',
        transition: 'box-shadow .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.07)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{est.customer_name}</span>
          <Tag color={statusCfg.color} style={{ fontSize: '10px' }}>{statusCfg.label}</Tag>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
          {fmtDate(est.created_at)}
          {est.expires_at && ` · exp. ${fmtDate(est.expires_at)}`}
        </div>
        {est.line_items?.length > 0 && (
          <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px' }}>
            {est.line_items[0].name}{est.line_items.length > 1 ? ` +${est.line_items.length - 1} more` : ''}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {fmtMoney(est.total)}
        </div>
        {est.deposit_amount != null && (
          <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
            dep. {fmtMoney(est.deposit_amount)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Estimates page ──────────────────────────────────────────────────────
const STATUS_TABS = [
  { key: 'all',          label: 'All' },
  { key: 'draft',        label: 'Draft' },
  { key: 'sent',         label: 'Sent' },
  { key: 'approved',     label: 'Approved' },
  { key: 'converted',    label: 'Converted' },
  { key: 'declined',     label: 'Declined' },
];

export function Estimates() {
  const location = useLocation();
  const [estimates, setEstimates] = useState([]);
  const [pricebook, setPricebook] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [view, setView] = useState('list'); // 'list' | 'new' | 'edit' | 'detail'
  const [selectedEst, setSelectedEst] = useState(null);

  // Check if navigated here from Leads page with prefill.
  // manualNewRef tracks whether the user manually clicked "+ New estimate",
  // which should NOT inherit the stale nav state prefill.
  const navState = location.state || {};
  const manualNewRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ests, pb, ls] = await Promise.all([fetchEstimates(), fetchPricebook(), fetchLeads()]);
      setEstimates(Array.isArray(ests) ? ests : []);
      setPricebook(Array.isArray(pb) ? pb : []);
      setLeads(Array.isArray(ls) ? ls : []);
    } catch (err) {
      console.error('Failed to load estimates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // If navigated from Leads with a lead pre-selected, go straight to new form
  useEffect(() => {
    if (navState.createForLead && !loading) {
      setView('new');
    }
  }, [navState.createForLead, loading]);

  const filtered = estimates.filter(e => tab === 'all' || e.status === tab);

  const handleSaved = (est, isEdit) => {
    if (isEdit) {
      setEstimates(prev => prev.map(e => e.id === est.id ? est : e));
    } else {
      setEstimates(prev => [est, ...prev]);
    }
    setSelectedEst(est);
    setView('detail');
  };

  const handleUpdate = (est) => {
    setEstimates(prev => prev.map(e => e.id === est.id ? est : e));
    setSelectedEst(est);
  };

  const openNew = () => {
    manualNewRef.current = true;
    setSelectedEst(null);
    setView('new');
  };

  const openDetail = (est) => {
    setSelectedEst(est);
    setView('detail');
  };

  const openEdit = () => setView('edit');

  const backToList = () => {
    setView('list');
    setSelectedEst(null);
  };

  // Initial prefill from nav state — only when opened via nav, not manually
  const initialFormData = (!manualNewRef.current && navState.createForLead) ? {
    lead_id: navState.createForLead.id,
    customer_name: navState.createForLead.contact_name || '',
    customer_phone: navState.createForLead.contact_phone || '',
    customer_email: navState.createForLead.contact_email || '',
  } : null;

  return (
    <div className="page active surface-page estimates-page" id="p-estimates">

        {/* ── List view ── */}
        {view === 'list' && (
          <>
            <PageHero
              className="estimates-hero"
              eyebrow="Pre-booking conversion"
              title="Estimates"
              subtitle="Quote faster, share a cleaner customer approval link, and move approved work straight into jobs."
              stat={{ value: String(estimates.length), label: 'total estimates' }}
            />

            <div className="toolbar-shell">
              <div className="filter-pills">
                {STATUS_TABS.map(t => (
                  <button
                    key={t.key}
                    className={`fbtn${tab === t.key ? ' on' : ''}`}
                    onClick={() => setTab(t.key)}
                  >
                    {t.label}
                    {t.key !== 'all' && estimates.filter(e => e.status === t.key).length > 0 && (
                      <span className="nb-badge" style={{ marginLeft: '5px' }}>
                        {estimates.filter(e => e.status === t.key).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button className="btn btn-dark btn-sm" onClick={openNew}>
                + New estimate
              </button>
            </div>

            {/* Stats row */}
            {estimates.length > 0 && (() => {
              const sent = estimates.filter(e => e.status === 'sent');
              const approved = estimates.filter(e => ['approved', 'deposit_paid'].includes(e.status));
              const pipeline = [...sent, ...approved].reduce((s, e) => s + Number(e.total || 0), 0);
              return (
                <div className="stats-strip compact">
                  {[
                    { label: 'Pipeline value', value: fmtMoney(pipeline), color: 'var(--text)' },
                    { label: 'Awaiting response', value: sent.length, color: 'var(--blue)' },
                    { label: 'Ready to convert', value: approved.length, color: 'var(--green)' },
                  ].map(s => (
                    <div key={s.label} className="stats-tile">
                      <div className="stats-tile-label">{s.label}</div>
                      <div className="stats-tile-value" style={{ color: s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* List */}
            {loading ? (
              <div className="loading">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="empty-state panel-empty">
                <div className="panel-empty-icon">📋</div>
                <div className="panel-empty-title">
                  {tab === 'all' ? 'No estimates yet' : `No ${tab} estimates`}
                </div>
                <div className="panel-empty-copy">
                  Create an estimate from a lead, conversation, or start fresh to begin your pre-booking conversion flow.
                </div>
                {tab === 'all' && (
                  <button className="btn btn-dark" onClick={openNew}>Create first estimate</button>
                )}
              </div>
            ) : (
              <div className="entity-stack">
                {filtered.map(est => (
                  <EstimateCard key={est.id} est={est} onClick={() => openDetail(est)} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── New / Edit form ── */}
        {(view === 'new' || view === 'edit') && (
          <>
            <button onClick={backToList} className="back-link">
              ← All estimates
            </button>
            <Card>
              <CardHeader>
                <CardTitle>{view === 'edit' ? 'Edit estimate' : 'New estimate'}</CardTitle>
              </CardHeader>
              <CardBody>
                <EstimateForm
                  initialData={view === 'edit' ? selectedEst : initialFormData}
                  leads={leads}
                  pricebook={pricebook}
                  onSave={handleSaved}
                  onCancel={view === 'edit' ? () => setView('detail') : backToList}
                />
              </CardBody>
            </Card>
          </>
        )}

        {/* ── Detail view ── */}
        {view === 'detail' && selectedEst && (
          <EstimateDetail
            estimate={selectedEst}
            onUpdate={handleUpdate}
            onEdit={openEdit}
            onClose={backToList}
          />
        )}
    </div>
  );
}
