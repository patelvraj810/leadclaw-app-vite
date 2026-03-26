import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  fetchPublicEstimate,
  publicApproveEstimate,
  publicDeclineEstimate,
  createEstimateDepositCheckout,
} from '../lib/api';
import { Tag } from '../components/ui/Tag';

const STATUS = {
  draft: { color: 'gray', label: 'Draft' },
  sent: { color: 'blue', label: 'Awaiting response' },
  approved: { color: 'green', label: 'Approved' },
  declined: { color: 'red', label: 'Declined' },
  expired: { color: 'amber', label: 'Expired' },
  deposit_paid: { color: 'green', label: 'Deposit paid' },
  converted: { color: 'blue', label: 'Booked' },
};

function fmtMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function fmtDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function PublicEstimate() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acting, setActing] = useState('');

  const paymentState = searchParams.get('payment');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPublicEstimate(token)
      .then(data => {
        if (!cancelled) {
          setEstimate(data);
          setError('');
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Unable to load estimate.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const statusCfg = STATUS[estimate?.status] || { color: 'gray', label: estimate?.status || 'Estimate' };

  const paymentBanner = useMemo(() => {
    if (paymentState === 'success') {
      return {
        bg: '#ecfdf5',
        border: '#86efac',
        text: '#166534',
        message: 'Deposit payment received. We are updating your estimate now.',
      };
    }
    if (paymentState === 'cancelled') {
      return {
        bg: '#fff7ed',
        border: '#fdba74',
        text: '#9a3412',
        message: 'Deposit checkout was cancelled. You can try again anytime below.',
      };
    }
    return null;
  }, [paymentState]);

  const runAction = async (kind) => {
    setActing(kind);
    setError('');
    try {
      if (kind === 'approve') {
        setEstimate(await publicApproveEstimate(token));
      } else if (kind === 'decline') {
        setEstimate(await publicDeclineEstimate(token));
      } else if (kind === 'deposit') {
        const result = await createEstimateDepositCheckout(token);
        window.location.href = result.url;
        return;
      }
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setActing('');
    }
  };

  return (
    <div className="public-estimate-page">
      <div className="public-estimate-shell">
        <div className="public-estimate-head">
          <div className="public-estimate-kicker">
            Matchit estimate portal
          </div>
          <div className="public-estimate-title">
            Review your estimate
          </div>
        </div>

        {loading ? (
          <div className="card public-estimate-card public-estimate-center">Loading estimate…</div>
        ) : error && !estimate ? (
          <div className="card public-estimate-card">
            <div className="public-estimate-card-title">Estimate unavailable</div>
            <div className="public-estimate-copy">{error}</div>
          </div>
        ) : estimate && (
          <>
            {paymentBanner && (
              <div
                className="public-banner"
                style={{
                  background: paymentBanner.bg,
                  borderColor: paymentBanner.border,
                  color: paymentBanner.text,
                }}
              >
                {paymentBanner.message}
              </div>
            )}

            {error && (
              <div className="public-banner public-banner-error">
                {error}
              </div>
            )}

            <div className="card public-estimate-card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '6px' }}>
                    From {estimate.business?.name || 'Your service provider'}
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '28px', marginBottom: '6px' }}>
                    {estimate.customer_name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
                    Created {fmtDate(estimate.created_at)}
                    {estimate.expires_at && ` · Expires ${fmtDate(estimate.expires_at)}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '34px', marginTop: '12px' }}>
                    {fmtMoney(estimate.total)}
                  </div>
                  {estimate.deposit_amount != null && (
                    <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: '600' }}>
                      Deposit due: {fmtMoney(estimate.deposit_amount)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card public-estimate-card" style={{ marginBottom: '16px' }}>
              <div className="public-estimate-kicker" style={{ marginBottom: '14px' }}>
                Line items
              </div>
              {(estimate.line_items || []).map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 90px 100px 110px',
                    gap: '10px',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--surface3)',
                    alignItems: 'start',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</div>
                    {item.description && (
                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '3px' }}>{item.description}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text2)' }}>{item.quantity || 1}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(item.unit_price)}</div>
                  <div style={{ textAlign: 'right', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", fontWeight: '600' }}>{fmtMoney(item.total)}</div>
                </div>
              ))}

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '36px', fontSize: '13px', color: 'var(--text2)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(estimate.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', gap: '36px', fontSize: '13px', color: 'var(--text2)' }}>
                  <span>Tax</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(estimate.tax_amount)}</span>
                </div>
                {estimate.deposit_amount != null && (
                  <div style={{ display: 'flex', gap: '36px', fontSize: '13px', color: 'var(--green)', fontWeight: '600' }}>
                    <span>Deposit required</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(estimate.deposit_amount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '36px', fontSize: '16px', fontWeight: '700' }}>
                  <span>Total</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fmtMoney(estimate.total)}</span>
                </div>
              </div>
            </div>

            <div className="card public-estimate-card">
              <div className="public-estimate-kicker" style={{ marginBottom: '14px' }}>
                Next step
              </div>

              {estimate.status === 'sent' && (
                <>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '16px' }}>
                    Review the estimate above and let {estimate.business?.name || 'your provider'} know whether you want to move forward.
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-dark" disabled={!!acting} onClick={() => runAction('approve')}>
                      {acting === 'approve' ? 'Approving…' : 'Approve estimate'}
                    </button>
                    <button className="btn btn-ghost" disabled={!!acting} onClick={() => runAction('decline')}>
                      {acting === 'decline' ? 'Declining…' : 'Decline'}
                    </button>
                  </div>
                </>
              )}

              {estimate.status === 'approved' && Number(estimate.deposit_amount || 0) > 0 && (
                <>
                  <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '16px' }}>
                    Your estimate is approved. To lock in the work, pay the required deposit of <strong>{fmtMoney(estimate.deposit_amount)}</strong>.
                  </div>
                  <button className="btn btn-dark" disabled={!!acting} onClick={() => runAction('deposit')}>
                    {acting === 'deposit' ? 'Redirecting…' : `Pay deposit ${fmtMoney(estimate.deposit_amount)}`}
                  </button>
                </>
              )}

              {estimate.status === 'approved' && Number(estimate.deposit_amount || 0) <= 0 && (
                <div style={{ fontSize: '14px', color: 'var(--green)', lineHeight: 1.7 }}>
                  This estimate has been approved. {estimate.business?.name || 'Your provider'} can now schedule the work.
                </div>
              )}

              {estimate.status === 'deposit_paid' && (
                <div style={{ fontSize: '14px', color: 'var(--green)', lineHeight: 1.7 }}>
                  Deposit received on {fmtDate(estimate.deposit_paid_at)}. Your provider can now move ahead with scheduling.
                </div>
              )}

              {estimate.status === 'declined' && (
                <div style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>
                  You declined this estimate on {fmtDate(estimate.declined_at)}. If this was a mistake, please contact {estimate.business?.name || 'your provider'} directly.
                </div>
              )}

              {estimate.status === 'expired' && (
                <div style={{ fontSize: '14px', color: 'var(--amber)', lineHeight: 1.7 }}>
                  This estimate has expired. Contact {estimate.business?.name || 'your provider'} if you would like an updated quote.
                </div>
              )}

              {estimate.status === 'converted' && (
                <div style={{ fontSize: '14px', color: 'var(--green)', lineHeight: 1.7 }}>
                  This estimate has already been converted into a job. Your provider will contact you with scheduling details if they have not already.
                </div>
              )}

              {(estimate.business?.email || estimate.business?.phone) && (
                <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '13px', color: 'var(--text2)' }}>
                  Need help?
                  {estimate.business?.email && (
                    <a href={`mailto:${estimate.business.email}`} style={{ color: 'var(--blue)', marginLeft: '6px' }}>
                      Email {estimate.business.email}
                    </a>
                  )}
                  {estimate.business?.phone && (
                    <a href={`tel:${estimate.business.phone}`} style={{ color: 'var(--blue)', marginLeft: '12px' }}>
                      Call {estimate.business.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
