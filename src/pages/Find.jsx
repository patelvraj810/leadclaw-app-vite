import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, Loader } from 'lucide-react';
import { submitFindRequest } from '../lib/api';

const CATEGORIES = [
  { value: 'hvac', label: 'HVAC', icon: '❄️' },
  { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'cleaning', label: 'Cleaning', icon: '✨' },
  { value: 'landscaping', label: 'Landscaping', icon: '🌿' },
  { value: 'appliance', label: 'Appliance', icon: '🔌' },
  { value: 'other', label: 'Other', icon: '🛠️' },
];

const URGENCY_OPTIONS = [
  { value: 'emergency', label: 'Emergency', emoji: '🔴', desc: 'Need help right now' },
  { value: 'this_week', label: 'This week', emoji: '🟡', desc: 'Within the next few days' },
  { value: 'quotes', label: 'Just getting quotes', emoji: '🟢', desc: 'No rush, comparing options' },
];

export function Find() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatWhatsApp = (val) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 10) return digits;
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
  };

  const handleWhatsAppChange = (e) => {
    setWhatsapp(formatWhatsApp(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!category) return setError('Please select what you need.');
    if (!urgency) return setError('Please select how urgent.');
    if (!whatsapp || whatsapp.replace(/\D/g, '').length < 10) return setError('Please enter a valid WhatsApp number.');

    setLoading(true);
    try {
      await submitFindRequest({
        category,
        urgency,
        description,
        whatsapp: whatsapp.replace(/\D/g, ''),
      });
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
            <div className="logo-dot"></div>
            Matchit
          </div>
        </nav>
        <div className="find-success">
          <div className="success-icon"><CheckCircle size={48} color="var(--green)" /></div>
          <h2>Request sent! 🎉</h2>
          <p>Aria will be in touch on WhatsApp within minutes.</p>
          <p style={{ fontSize: '14px', color: 'var(--text3)', marginTop: '8px' }}>
            Make sure you have WhatsApp open so you don't miss the message.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="find-page">
      <nav className="nav">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-dot"></div>
          Matchit
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" onClick={() => navigate('/login')}>Sign in</Button>
        </div>
      </nav>

      <div className="find-container">
        <div className="find-header">
          <div className="find-badge">Matchit · Find a Pro</div>
          <h1 className="find-headline">Need something fixed? Fast.</h1>
          <p className="find-sub">
            Tell us what you need — we'll connect you with an available pro in your area within minutes.
          </p>
        </div>

        <form className="find-form" onSubmit={handleSubmit}>
          {/* Category selector */}
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

          {/* Urgency */}
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

          {/* Description */}
          <div className="find-field">
            <label className="find-label">
              Describe the issue <span className="find-optional">(optional)</span>
            </label>
            <textarea
              className="find-textarea"
              placeholder="E.g., AC not cooling, leaking faucet, circuit breaker tripping..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* WhatsApp */}
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
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader size={16} className="spin" /> Sending request…
              </span>
            ) : (
              'Find me a pro →'
            )}
          </Button>

          <p className="find-disclaimer">
            By submitting, you agree to be contacted via WhatsApp. No spam, no obligations.
          </p>
        </form>
      </div>
    </div>
  );
}
