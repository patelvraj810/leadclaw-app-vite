import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <div className="ob-head">
          <div className="ob-dots">
            <div className="ob-dot done"></div>
            <div className="ob-dot active"></div>
            <div className="ob-dot"></div>
          </div>
          <div className="ob-lbl">STEP 1 OF 2</div>
          <h1 className="ob-title">Welcome back</h1>
          <p className="ob-sub">Sign in to your Matchit account</p>
        </div>

        <form className="ob-body" onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: 'var(--red-bg)', color: 'var(--red)', padding: '10px 14px', borderRadius: 'var(--r)', marginBottom: '16px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-dark btn-full"
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="ob-foot" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: '0' }}>
          <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Don't have an account? </span>
          <Link to="/signup" className="btn btn-ghost btn-sm" style={{ marginLeft: '8px', textDecoration: 'none' }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
