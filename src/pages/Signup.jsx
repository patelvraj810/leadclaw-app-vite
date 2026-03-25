import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INDUSTRIES = [
  'Real Estate',
  'Healthcare',
  'Legal',
  'Finance',
  'E-commerce',
  'SaaS',
  'Marketing',
  'Education',
  'Restaurant',
  'Automotive',
  'Home Services',
  'Other',
];

export function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    industry: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) { setError('Name is required'); return false; }
    if (!formData.email.trim()) { setError('Email is required'); return false; }
    if (!formData.email.includes('@')) { setError('Please enter a valid email'); return false; }
    if (!formData.password) { setError('Password is required'); return false; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.businessName.trim()) { setError('Business name is required'); return false; }
    if (!formData.industry) { setError('Please select an industry'); return false; }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password, formData.businessName, formData.industry);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <div className="ob-head">
          <div className="ob-dots">
            <div className={`ob-dot ${step >= 1 ? 'done' : ''}`}></div>
            <div className={`ob-dot ${step >= 2 ? 'done' : ''}`}></div>
            <div className="ob-dot"></div>
          </div>
          <div className="ob-lbl">STEP {step} OF 2</div>
          <h1 className="ob-title">{step === 1 ? 'Create your account' : 'Business details'}</h1>
          <p className="ob-sub">{step === 1 ? 'Start your 14-day free trial' : 'Tell us about your business'}</p>
        </div>

        <form className="ob-body" onSubmit={step === 1 ? handleNextStep : handleSubmit}>
          {error && (
            <div style={{ background: 'var(--red-bg)', color: 'var(--red)', padding: '10px 14px', borderRadius: 'var(--r)', marginBottom: '16px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="John Smith" />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-dark btn-full">
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="field">
                <label htmlFor="businessName">Business Name</label>
                <input id="businessName" name="businessName" type="text" required value={formData.businessName} onChange={handleChange} placeholder="Acme Inc." />
              </div>
              <div className="field">
                <label htmlFor="industry">Industry</label>
                <select id="industry" name="industry" required value={formData.industry} onChange={handleChange}>
                  <option value="">Select an industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="phone">Phone <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(optional)</span></label>
                <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => { setStep(1); setError(''); }} className="btn btn-ghost" style={{ flex: 1 }}>
                  Back
                </button>
                <button type="submit" disabled={loading} className="btn btn-dark" style={{ flex: 1 }}>
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="ob-foot" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: '0' }}>
          <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Already have an account? </span>
          <Link to="/login" className="btn btn-ghost btn-sm" style={{ marginLeft: '8px', textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
