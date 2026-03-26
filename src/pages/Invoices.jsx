import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  fetchInvoices, createInvoice, updateInvoice,
  markInvoicePaid, sendInvoiceToCustomer,
  fetchJobs, fetchPricebook,
} from '../lib/api';
import { LineItemsEditor } from '../components/LineItemsEditor';
import { createLineItem } from '../lib/lineItems';
import { Tag } from '../components/ui/Tag';
import { Card, CardBody } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';
import { ModalShell } from '../components/ui/ModalShell';

// ─── Constants ────────────────────────────────────────────────────────────────
const TAX_RATE = 0.13;

const STATUS_CFG = {
  draft:     { color: 'gray',  label: 'Draft' },
  sent:      { color: 'blue',  label: 'Sent' },
  unpaid:    { color: 'amber', label: 'Unpaid' },
  paid:      { color: 'green', label: 'Paid' },
  overdue:   { color: 'red',   label: 'Overdue' },
  cancelled: { color: 'gray',  label: 'Cancelled' },
};

const STATUS_FILTERS = ['all', 'draft', 'sent', 'paid', 'overdue', 'unpaid', 'cancelled'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtMoney(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

function shortId(id) {
  return (id || '').slice(0, 8).toUpperCase();
}

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function calcTotals(items, taxRate = TAX_RATE) {
  const subtotal   = items.reduce((s, i) => s + Number(i.quantity || 1) * Number(i.unit_price || 0), 0);
  const tax_amount = Math.round(subtotal * taxRate * 100) / 100;
  const total      = Math.round((subtotal + tax_amount) * 100) / 100;
  return { subtotal: Math.round(subtotal * 100) / 100, tax_amount, total };
}

// ─── Create / Edit Invoice Modal ──────────────────────────────────────────────
function InvoiceModal({ prefillJobId, completedJobs, pricebook, onCreated, onClose }) {
  const [jobId, setJobId]               = useState(prefillJobId || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [description, setDescription]   = useState('');
  const [lineItems, setLineItems]        = useState([createLineItem()]);
  const [taxRate]                        = useState(TAX_RATE);
  const [dueDate, setDueDate]            = useState(() => defaultDueDate());
  const [submitting, setSubmitting]      = useState(false);
  const [error, setError]                = useState('');

  // Prefill from selected job
  useEffect(() => {
    const job = completedJobs.find(j => j.id === jobId);
    if (!job) return;
    setCustomerName(job.customer_name || '');
    setCustomerPhone(job.customer_phone || '');
    setCustomerEmail(job.customer_email || '');
    setDescription(job.job_description || '');
    // Prefill single line item from job price if available
    if (job.price) {
      setLineItems([{
        _key: 'from_job',
        name: job.service_type || job.job_description || 'Service',
        description: job.job_description || '',
        quantity: 1,
        unit_price: Number(job.price),
        unit: 'each',
        total: Number(job.price),
      }]);
    }
  }, [completedJobs, jobId]);

  const totals = calcTotals(lineItems, taxRate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) { setError('Customer name is required.'); return; }
    if (!description.trim())  { setError('Job description is required.'); return; }
    if (totals.subtotal <= 0) { setError('Invoice total must be greater than zero.'); return; }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        job_id:          jobId || undefined,
        customer_name:   customerName,
        customer_phone:  customerPhone || undefined,
        customer_email:  customerEmail || undefined,
        job_description: description,
        line_items:      lineItems.map(item => {
          const rest = { ...item };
          delete rest._key;
          return rest;
        }),
        subtotal:        totals.subtotal,
        tax_rate:        taxRate,
        due_date:        dueDate || undefined,
      };
      const created = await createInvoice(payload);
      onCreated(created);
    } catch (err) {
      setError(err.message || 'Failed to create invoice.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="New invoice"
      subtitle="Create a clean invoice that matches the rest of your Matchit workflow."
      onClose={onClose}
      maxWidth={760}
    >
      <form onSubmit={handleSubmit} className="entity-form">
        {completedJobs.length > 0 && (
          <div className="form-section">
            <div className="form-section-head">
              <div className="form-section-title">Start from a completed job</div>
              <div className="form-section-copy">Optional, but useful for pre-filling customer and service details.</div>
            </div>
            <div className="field">
              <label>Create from completed job</label>
              <select value={jobId} onChange={e => setJobId(e.target.value)}>
                <option value="">Manual entry</option>
                {completedJobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.customer_name} — {j.job_description?.slice(0, 50)}{j.job_description?.length > 50 ? '…' : ''}
                    {j.price ? ` · $${Number(j.price).toFixed(2)}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="form-section">
          <div className="form-section-head">
            <div className="form-section-title">Customer details</div>
            <div className="form-section-copy">Keep the invoice simple and readable for the customer on the other end.</div>
          </div>
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

        <div className="form-section">
          <div className="field-row field-row-tight">
            <div className="field">
              <label>Job / service description <span className="field-required">*</span></label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. HVAC furnace replacement" />
            </div>
            <div className="field">
              <label>Due date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-head">
            <div className="form-section-title">Line items</div>
            <div className="form-section-copy">Use the same item structure as estimates so pricing stays familiar across the app.</div>
          </div>
          <LineItemsEditor
            items={lineItems}
            onChange={setLineItems}
            pricebook={pricebook}
            quantityMin="1"
            quantityStep="1"
            customLabel="+ Add line"
          />
        </div>

        <div className="summary-panel">
          {[
            { label: 'Subtotal', value: fmtMoney(totals.subtotal) },
            { label: `Tax (${(taxRate * 100).toFixed(0)}% HST)`, value: fmtMoney(totals.tax_amount) },
            { label: 'Total', value: fmtMoney(totals.total), emphatic: true },
          ].map((row) => (
            <div key={row.label} className={`summary-row${row.emphatic ? ' emphatic' : ''}`}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>

        {error ? <div className="form-error">{error}</div> : null}

        <div className="form-actions">
          <button type="submit" className="btn btn-dark" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create invoice'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Invoice card ──────────────────────────────────────────────────────────────
function InvoiceCard({ invoice, onUpdate }) {
  const [actionLoading, setActionLoading] = useState(null);
  const cfg = STATUS_CFG[invoice.status] || { color: 'gray', label: invoice.status };
  const custName = invoice.customer_name || invoice.jobs?.customer_name || '—';
  const isActionable = !['paid', 'cancelled'].includes(invoice.status);

  const runAction = async (action) => {
    setActionLoading(action);
    try {
      let updated;
      if (action === 'mark-paid') {
        updated = await markInvoicePaid(invoice.id);
      } else if (action === 'send' || action === 'resend') {
        const result = await sendInvoiceToCustomer(invoice.id);
        updated = result.invoice;
      } else if (action === 'cancel') {
        updated = await updateInvoice(invoice.id, { status: 'cancelled' });
      }
      if (updated) onUpdate(updated);
    } catch (err) {
      console.error('Invoice action failed:', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Card>
      <CardBody>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Customer + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>{custName}</span>
              <Tag color={cfg.color} style={{ fontSize: '10px' }}>{cfg.label}</Tag>
              <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                #{shortId(invoice.id)}
              </span>
            </div>

            {/* Description */}
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '6px' }}>
              {invoice.job_description || '—'}
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text3)' }}>
              <span>Created {fmtDate(invoice.created_at)}</span>
              {invoice.due_date && <span>Due {fmtDate(invoice.due_date)}</span>}
              {invoice.sent_at && <span>Sent {fmtDate(invoice.sent_at)}</span>}
              {invoice.paid_at && <span style={{ color: 'var(--green)', fontWeight: '600' }}>Paid {fmtDate(invoice.paid_at)}</span>}
              {invoice.stripe_payment_link && (
                <a
                  href={invoice.stripe_payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--blue)', textDecoration: 'none' }}
                >
                  Payment link ↗
                </a>
              )}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '16px', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" }}>
              {fmtMoney(invoice.total)}
            </span>

            {isActionable && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {invoice.status === 'draft' && (
                  <button
                    className="btn btn-dark btn-sm"
                    disabled={!!actionLoading}
                    onClick={() => runAction('send')}
                  >
                    {actionLoading === 'send' ? 'Sending…' : 'Send'}
                  </button>
                )}
                {['sent', 'unpaid'].includes(invoice.status) && (
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={!!actionLoading}
                    onClick={() => runAction('resend')}
                    title="Re-send payment link to customer"
                  >
                    {actionLoading === 'resend' ? 'Sending…' : 'Resend'}
                  </button>
                )}
                {['draft', 'sent', 'unpaid'].includes(invoice.status) && (
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={!!actionLoading}
                    onClick={() => runAction('mark-paid')}
                  >
                    {actionLoading === 'mark-paid' ? '…' : 'Mark paid'}
                  </button>
                )}
                {invoice.status !== 'cancelled' && (
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={!!actionLoading}
                    onClick={() => runAction('cancel')}
                    style={{ color: 'var(--text3)' }}
                  >
                    {actionLoading === 'cancel' ? '…' : 'Cancel'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Main Invoices page ───────────────────────────────────────────────────────
export function Invoices() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [invoices, setInvoices]       = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [pricebook, setPricebook]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal]     = useState(false);

  // If arriving from Jobs/Field with ?job=<id>, open modal immediately
  const prefillJobId = searchParams.get('job') || '';

  useEffect(() => {
    Promise.allSettled([
      fetchInvoices(),
      fetchJobs({ status: 'completed' }),
      fetchPricebook(),
    ]).then(([invRes, jobsRes, pbRes]) => {
      setInvoices(invRes.status === 'fulfilled' ? (invRes.value || []) : []);
      setCompletedJobs(jobsRes.status === 'fulfilled' ? (jobsRes.value || []) : []);
      setPricebook(pbRes.status === 'fulfilled' ? (pbRes.value?.items || pbRes.value || []) : []);
      if (prefillJobId) setShowModal(true);
    }).finally(() => setLoading(false));
  }, [prefillJobId]);

  const handleCreated = (inv) => {
    setInvoices(prev => [inv, ...prev]);
    setShowModal(false);
    // Remove job param from URL
    if (prefillJobId) navigate('/app/invoices', { replace: true });
  };

  const handleUpdate = (updated) => {
    setInvoices(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const filtered = statusFilter === 'all'
    ? invoices
    : invoices.filter(i => i.status === statusFilter);

  // Stats
  const paid      = invoices.filter(i => i.status === 'paid');
  const outstanding = invoices.filter(i => ['sent', 'unpaid'].includes(i.status));
  const overdue   = invoices.filter(i => i.status === 'overdue');
  const paidTotal = paid.reduce((s, i) => s + Number(i.total || 0), 0);
  const outTotal  = outstanding.reduce((s, i) => s + Number(i.total || 0), 0);

  return (
    <div className="page active surface-page invoices-page" id="p-invoices">
      <PageHero
        className="invoices-hero"
        eyebrow="Revenue workflow"
        title="Invoices"
        subtitle="Turn completed jobs into clean, customer-ready invoices that match the rest of the Matchit experience."
        stat={{ value: fmtMoney(outTotal), label: 'currently outstanding' }}
      />

      {!loading && invoices.length > 0 && (
        <div className="stats-strip">
          {[
            { label: 'Total invoiced', value: fmtMoney(invoices.reduce((s, i) => s + Number(i.total || 0), 0)), sub: `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}` },
            { label: 'Paid', value: fmtMoney(paidTotal), sub: `${paid.length} paid`, tone: 'green' },
            { label: 'Outstanding', value: fmtMoney(outTotal), sub: `${outstanding.length} awaiting payment`, tone: outstanding.length ? 'amber' : '' },
            { label: 'Overdue', value: String(overdue.length), sub: overdue.length ? 'need follow-up' : 'none', tone: overdue.length ? 'red' : '' },
          ].map((stat) => (
            <div key={stat.label} className={`stats-tile${stat.tone ? ` ${stat.tone}` : ''}`}>
              <div className="stats-tile-label">{stat.label}</div>
              <div className="stats-tile-value">{stat.value}</div>
              <div className="stats-tile-copy">{stat.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div className="toolbar-shell">
        <div className="filter-pills">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`fbtn${statusFilter === f ? ' on' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f === 'all' ? 'All' : STATUS_CFG[f]?.label || f}
              {f !== 'all' && invoices.filter(i => i.status === f).length > 0 ? (
                <span className="nb-badge" style={{ marginLeft: '5px' }}>{invoices.filter(i => i.status === f).length}</span>
              ) : null}
            </button>
          ))}
        </div>
        <button className="btn btn-dark btn-sm" onClick={() => setShowModal(true)}>
          + New invoice
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state panel-empty">
          <div className="panel-empty-copy">
            {statusFilter === 'all'
              ? 'No invoices yet. Create your first invoice from a completed job.'
              : `No ${STATUS_CFG[statusFilter]?.label?.toLowerCase() || statusFilter} invoices.`}
          </div>
          {statusFilter === 'all' && completedJobs.length > 0 ? (
            <button className="btn btn-dark btn-sm" onClick={() => setShowModal(true)}>
              Create from completed job
            </button>
          ) : null}
        </div>
      ) : (
        <div className="entity-stack">
          {filtered.map(inv => (
            <InvoiceCard key={inv.id} invoice={inv} onUpdate={handleUpdate} />
          ))}
        </div>
      )}

      {!loading && invoices.length > 0 && (
        <div className="helper-note">
          <strong>Payment collection:</strong> Stripe payment links are generated when you send an invoice. Set <code>STRIPE_SECRET_KEY</code> and <code>STRIPE_WEBHOOK_SECRET</code> in your backend <code>.env</code> to enable automatic payment confirmation. Until then, use "Mark paid" to manually record received payments.
        </div>
      )}

      {/* ── Create modal ── */}
      {showModal && (
        <InvoiceModal
          prefillJobId={prefillJobId}
          completedJobs={completedJobs}
          pricebook={pricebook}
          onCreated={handleCreated}
          onClose={() => { setShowModal(false); if (prefillJobId) navigate('/app/invoices', { replace: true }); }}
        />
      )}
    </div>
  );
}
