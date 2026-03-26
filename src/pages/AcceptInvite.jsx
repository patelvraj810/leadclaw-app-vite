import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { getInvitePreview, acceptInvite } from '../lib/api';

const ROLE_LABELS = {
  owner:      'Owner',
  admin:      'Admin',
  dispatcher: 'Dispatcher',
  technician: 'Technician',
};

export function AcceptInvite() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get('token');

  const [preview,     setPreview]     = useState(null);
  const [inviteState, setInviteState] = useState('loading'); // loading | valid | expired | accepted | revoked | not_found
  const [stateMsg,    setStateMsg]    = useState('');

  const [name,        setName]        = useState('');
  const [password,    setPassword]    = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!token) {
      setInviteState('not_found');
      return;
    }
    getInvitePreview(token)
      .then(data => {
        setPreview(data);
        setInviteState('valid');
      })
      .catch(err => {
        const status = err?.data?.status || 'not_found';
        setInviteState(status);
        setStateMsg(err.message || 'This invite is no longer valid.');
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !password) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const data = await acceptInvite({ token, name: name.trim(), password });
      // Store auth token + user, then go to app
      localStorage.setItem('matchit_token', data.token);
      localStorage.setItem('matchit_user', JSON.stringify(data.user));
      navigate('/app/dashboard');
    } catch (err) {
      if (err?.data?.code === 'email_exists') {
        setSubmitError('An account with this email already exists. Please log in instead.');
      } else {
        setSubmitError(err.message || 'Failed to accept invite. Please try again.');
      }
      setSubmitting(false);
    }
  };

  // ── Shell ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center', marginBottom: '32px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '22px', fontWeight: '700', letterSpacing: '-.02em',
        }}>
          Matchit
        </div>

        {/* Loading */}
        {inviteState === 'loading' && (
          <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '14px' }}>
            Loading invite…
          </div>
        )}

        {/* Invalid states */}
        {['expired', 'accepted', 'revoked', 'not_found'].includes(inviteState) && (
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--rl)',
            padding: '32px', textAlign: 'center',
            border: '1px solid var(--surface3)',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>
              {inviteState === 'accepted' ? '✓' : inviteState === 'expired' ? '⏰' : '🚫'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              {inviteState === 'accepted'  && 'Invite already accepted'}
              {inviteState === 'expired'   && 'Invite has expired'}
              {inviteState === 'revoked'   && 'Invite has been revoked'}
              {inviteState === 'not_found' && 'Invite not found'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text3)', lineHeight: 1.6, marginBottom: '20px' }}>
              {inviteState === 'accepted'  && 'This invite was already used. If you have an account, please log in.'}
              {inviteState === 'expired'   && 'This invite link has expired. Ask the workspace owner to resend it.'}
              {inviteState === 'revoked'   && 'This invite has been revoked. Contact the workspace owner for a new one.'}
              {inviteState === 'not_found' && (stateMsg || 'This invite link is invalid or has already been used.')}
            </div>
            <Link to="/login" style={{
              display: 'inline-block', padding: '10px 20px',
              background: 'var(--text)', color: '#fff', borderRadius: 'var(--r)',
              fontSize: '13px', fontWeight: '600', textDecoration: 'none',
            }}>
              Go to login
            </Link>
          </div>
        )}

        {/* Valid invite */}
        {inviteState === 'valid' && preview && (
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--rl)',
            border: '1px solid var(--surface3)',
            overflow: 'hidden',
          }}>
            {/* Invite context banner */}
            <div style={{
              padding: '20px 24px',
              background: 'var(--surface2)',
              borderBottom: '1px solid var(--surface3)',
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text3)', marginBottom: '4px' }}>
                You've been invited to join
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '6px' }}>
                {preview.workspace_name}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px', fontWeight: '600', padding: '2px 8px',
                  background: 'var(--surface3)', borderRadius: '20px', color: 'var(--text2)',
                }}>
                  {ROLE_LABELS[preview.role] || preview.role}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
                  {preview.email}
                </span>
                {preview.inviter_name && (
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
                    · invited by {preview.inviter_name}
                  </span>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px' }}>
                Create your account
              </div>

              <div className="field">
                <label>Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  autoFocus
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={preview.email}
                  readOnly
                  style={{ background: 'var(--surface2)', color: 'var(--text3)', cursor: 'not-allowed' }}
                />
              </div>

              <div className="field" style={{ marginBottom: '20px' }}>
                <label>Create a password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              {submitError && (
                <div style={{
                  fontSize: '13px', color: 'var(--red)',
                  marginBottom: '14px', lineHeight: 1.5,
                }}>
                  {submitError}
                  {submitError.includes('log in') && (
                    <> <Link to="/login" style={{ color: 'var(--blue)' }}>Log in →</Link></>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-dark"
                style={{ width: '100%' }}
                disabled={submitting || !name.trim() || !password}
              >
                {submitting ? 'Creating account…' : 'Accept invite & join'}
              </button>

              <div style={{
                marginTop: '16px', textAlign: 'center',
                fontSize: '12px', color: 'var(--text3)',
              }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--text2)' }}>Log in</Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
