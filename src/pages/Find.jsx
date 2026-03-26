import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, Loader, ArrowLeft } from 'lucide-react';
import { submitFindRequest } from '../lib/api';

const CATEGORIES = [
  { value: 'hvac',        label: 'HVAC',        icon: '❄️' },
  { value: 'plumbing',    label: 'Plumbing',    icon: '🔧' },
  { value: 'electrical',  label: 'Electrical',  icon: '⚡' },
  { value: 'cleaning',    label: 'Cleaning',    icon: '✨' },
  { value: 'landscaping', label: 'Landscaping', icon: '🌿' },
  { value: 'appliance',   label: 'Appliance',   icon: '🔌' },
  { value: 'roofing',     label: 'Roofing',     icon: '🏠' },
  { value: 'other',       label: 'Other',       icon: '🛠️' },
];

const URGENCY_OPTIONS = [
  { value: 'emergency',  label: 'Emergency',           emoji: '🔴', desc: 'Need help right now — today' },
  { value: 'this_week',  label: 'This week',           emoji: '🟡', desc: 'Within the next few days' },
  { value: 'quotes',     label: 'Just getting quotes', emoji: '🟢', desc: 'No rush, comparing options' },
];

const TRUST_ITEMS = [
  { icon: '⚡', text: 'Pros reply within minutes' },
  { icon: '🔒', text: 'No account needed' },
  { icon: '💬', text: 'Matched via WhatsApp' },
];

function formatWhatsApp(val) {
  const digits = val.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
}

export function Find() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleWhatsAppChange = (e) => setWhatsapp(formatWhatsApp(e.target.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!category) return setError('Please select what you need.');
    if (!urgency)  return setError('Please select how urgent.');
    if (!whatsapp || whatsapp.replace(/\D/g, '').length < 10) return setError('Please enter a valid WhatsApp number.');
    setLoading(true);
    try {
      await submitFindRequest({ category, urgency, description, whatsapp: whatsapp.replace(/\D/g, '') });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="find-page">
        <nav className="nav">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-dot" />
            Matchit
          </div>
        </nav>
        <div className="find-success">
          <div className="success-icon">
            <CheckCircle size={56} color="var(--green)" strokeWidth={1.5} />
          </div>
          <h2>You're all set 🎉</h2>
          <p>A Matchit pro will reach out on WhatsApp within minutes. Keep your phone handy.</p>
          <p style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '6px' }}>
            No account needed. No spam. Just a pro ready to help.
          </p>
          <Button variant="ghost" style={{ marginTop: '24px' }} onClick={() => navigate('/')}>
            <ArrowLeft size={14} /> Back to Matchit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="find-page">
      <nav className="nav">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-dot" />
          Matchit
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {TRUST_ITEMS.map((t) => (
            <span key={t.text} className="find-trust-chip">
              {t.icon} {t.text}
            </span>
          ))}
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
        </div>
      </nav>

      <div className="find-layout">
        {/* LEFT — context pane */}
        <div className="find-context">
          <div className="find-context-inner">
            <div className="find-badge">Matchit Find · GTA</div>
            <h1 className="find-headline">Need something fixed?<br />We'll find you a pro.</h1>
            <p className="find-sub">
              Tell us what you need. We'll connect you with an available, vetted pro in your area — usually within minutes.
            </p>

            <div className="find-trust-list">
              {[
                { icon: '⚡', title: 'Instant matching', desc: 'AI matches your request to available pros right now' },
                { icon: '💬', title: 'WhatsApp first', desc: 'No portals or accounts — just a conversation that starts fast' },
                { icon: '✅', title: 'Verified service pros', desc: 'Every pro on Matchit runs a real, operating business' },
              ].map((item) => (
                <div key={item.title} className="find-trust-item">
                  <span className="find-trust-icon">{item.icon}</span>
                  <div>
                    <div className="find-trust-title">{item.title}</div>
                    <div className="find-trust-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="find-live-badge">
              <span className="hero-live-dot" style={{ width: 8, height: 8 }} />
              Pros available in GTA right now
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="find-container">
          <form className="find-form" onSubmit={handleSubmit}>
            <div className="find-field">
              <label className="find-label">What do you need?</label>
              <div className="category-grid">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`category-card ${category === cat.value ? 'selected' : ''}`}
                    onClick={() => setCategory(cat.value)}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span className="category-label">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="find-field">
              <label className="find-label">How urgent?</label>
              <div className="urgency-options">
                {URGENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`urgency-card ${urgency === opt.value ? 'selected' : ''}`}
                    onClick={() => setUrgency(opt.value)}
                  >
                    <span className="urgency-emoji">{opt.emoji}</span>
                    <div>
                      <div className="urgency-label">{opt.label}</div>
                      <div className="urgency-desc">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="find-field">
              <label className="find-label">
                Describe the issue <span className="find-optional">(optional but helps)</span>
              </label>
              <textarea
                className="find-textarea"
                placeholder="E.g., AC not cooling, leaking faucet under sink, circuit breaker keeps tripping…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="find-field">
              <label className="find-label">
                Your WhatsApp number <span className="find-required">*</span>
              </label>
              <input
                type="tel"
                className="find-input"
                placeholder="(416) 555-0123"
                value={whatsapp}
                onChange={handleWhatsAppChange}
                maxLength={14}
              />
              <p className="find-hint">We'll reach you here — no account needed.</p>
            </div>

            {error && <div className="find-error">{error}</div>}

            <Button type="submit" size="lg" fullWidth disabled={loading}>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Loader size={16} className="spin" /> Finding your pro…</span>
                : 'Find me a pro →'
              }
            </Button>

            <p className="find-disclaimer">
              By submitting, you agree to be contacted via WhatsApp. No spam, no obligations.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
