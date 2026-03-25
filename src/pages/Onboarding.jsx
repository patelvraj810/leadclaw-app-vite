import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { completeOnboarding } from '../lib/api';

const TOTAL_STEPS = 7;

const INDUSTRIES = [
  { name: 'HVAC', icon: '❄️' },
  { name: 'Plumbing', icon: '🔧' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Cleaning', icon: '✨' },
  { name: 'Landscaping', icon: '🌿' },
  { name: 'Appliance Repair', icon: '🔌' },
  { name: 'Roofing', icon: '🏠' },
  { name: 'Painting', icon: '🎨' },
  { name: 'Flooring', icon: '🪵' },
  { name: 'General Contracting', icon: '🔨' },
  { name: 'Real Estate', icon: '🏡' },
  { name: 'Other', icon: '⚙️' },
];

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', desc: 'Formal, confident, expert-level' },
  { value: 'friendly', label: 'Friendly', desc: 'Warm, approachable, conversational' },
  { value: 'direct', label: 'Direct', desc: 'Fast, no fluff, to the point' },
];

const SOURCES = [
  { name: 'WhatsApp', icon: '💬' },
  { name: 'Website Form', icon: '🌐' },
  { name: 'Facebook Ads', icon: '📘' },
  { name: 'Google Ads', icon: '📢' },
  { name: 'Instagram DMs', icon: '📸' },
  { name: 'SMS', icon: '📱' },
  { name: 'Kijiji', icon: '📋' },
  { name: 'HomeStars', icon: '⭐' },
  { name: 'Manual Import', icon: '📂' },
  { name: 'Referrals', icon: '🤝' },
];

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    features: ['100 leads/month', 'Website form', 'Email', 'AI qualification'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99',
    popular: true,
    features: ['500 leads/month', 'WhatsApp + SMS', 'Google & Facebook Ads', 'AI booking + invoices'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$199',
    features: ['Unlimited leads', 'AI phone answering', 'Facebook Groups + Instagram', 'Done-for-you setup'],
  },
];

const DEFAULT_HOURS = {
  mon: { enabled: true, open: '08:00', close: '18:00' },
  tue: { enabled: true, open: '08:00', close: '18:00' },
  wed: { enabled: true, open: '08:00', close: '18:00' },
  thu: { enabled: true, open: '08:00', close: '18:00' },
  fri: { enabled: true, open: '08:00', close: '17:00' },
  sat: { enabled: false, open: '09:00', close: '14:00' },
  sun: { enabled: false, open: '09:00', close: '14:00' },
};

const DAY_LABELS = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
const DAY_SHORT = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };

export function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // ---- Form state accumulated across all steps ----
  const [form, setForm] = useState({
    // Step 1
    phone: '',
    city: '',
    yearsInBusiness: '',
    industry: '',
    // Step 2
    services: [],
    serviceInput: '',
    startingPrice: '',
    emergencyAvailable: false,
    serviceArea: '',
    // Step 3
    agentName: 'Alex',
    tone: 'professional',
    openingMessage: '',
    // Step 4 — Knowledge (3 text areas)
    pricingKnowledge: '',
    faqKnowledge: '',
    aboutKnowledge: '',
    // Step 5 — Hours
    operatingHours: DEFAULT_HOURS,
    // Step 6 — Sources
    selectedSources: ['WhatsApp'],
    // Step 7 — Plan
    subscriptionTier: 'pro',
    googleReviewLink: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Tag input helpers
  const addService = () => {
    const s = form.serviceInput.trim();
    if (s && !form.services.includes(s)) {
      set('services', [...form.services, s]);
      set('serviceInput', '');
    }
  };
  const removeService = (s) => set('services', form.services.filter(x => x !== s));
  const handleServiceKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addService(); }
  };

  // Source toggle
  const toggleSource = (name) => {
    set('selectedSources',
      form.selectedSources.includes(name)
        ? form.selectedSources.filter(s => s !== name)
        : [...form.selectedSources, name]
    );
  };

  // Hours helpers
  const setHour = (day, field, val) => {
    set('operatingHours', {
      ...form.operatingHours,
      [day]: { ...form.operatingHours[day], [field]: val },
    });
  };

  const next = () => {
    setError('');
    if (step === 1 && !form.city.trim()) { setError('Please enter your city or service area.'); return; }
    if (step === 2 && form.services.length === 0) { setError('Add at least one service you offer.'); return; }
    if (step === 3 && !form.agentName.trim()) { setError('Give your AI agent a name.'); return; }
    setStep(s => s + 1);
  };

  const back = () => { setError(''); setStep(s => s - 1); };

  const launch = async () => {
    setSaving(true);
    setError('');
    try {
      const knowledge = [];
      if (form.pricingKnowledge.trim()) knowledge.push({ doc_name: 'Pricing', doc_type: 'pricing', raw_content: form.pricingKnowledge });
      if (form.faqKnowledge.trim()) knowledge.push({ doc_name: 'FAQ', doc_type: 'faq', raw_content: form.faqKnowledge });
      if (form.aboutKnowledge.trim()) knowledge.push({ doc_name: 'About & Differentiators', doc_type: 'about', raw_content: form.aboutKnowledge });

      await completeOnboarding({
        phone: form.phone,
        city: form.city,
        yearsInBusiness: form.yearsInBusiness,
        services: form.services,
        startingPrice: form.startingPrice,
        emergencyAvailable: form.emergencyAvailable,
        serviceArea: form.serviceArea || form.city,
        agentName: form.agentName,
        tone: form.tone,
        openingMessage: form.openingMessage || defaultOpeningMessage(),
        knowledge,
        operatingHours: form.operatingHours,
        selectedSources: form.selectedSources,
        subscriptionTier: form.subscriptionTier,
        googleReviewLink: form.googleReviewLink,
      });

      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
      setSaving(false);
    }
  };

  const defaultOpeningMessage = () => {
    const biz = user?.businessName || 'us';
    return `Hi! I'm ${form.agentName} from ${biz}. Thanks for reaching out! What can I help you with today?`;
  };

  const openingPreview = form.openingMessage.trim() || defaultOpeningMessage();

  return (
    <div className="ob-wrap">
      <div className="ob-card">

        {/* Progress bar */}
        <div className="ob-progress">
          <div className="ob-progress-bar" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>

        {/* Header */}
        <div className="ob-head">
          <div className="ob-dots">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(i => (
              <div key={i} className={`ob-dot ${i < step ? 'done' : i === step ? 'active' : ''}`} />
            ))}
          </div>
          <div className="ob-lbl">Step {step} of {TOTAL_STEPS}</div>
          <StepHeader step={step} />
        </div>

        {/* Body */}
        <div className="ob-body">
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--r)', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          {step === 1 && <StepBusiness form={form} set={set} user={user} />}
          {step === 2 && <StepServices form={form} set={set} addService={addService} removeService={removeService} handleServiceKeyDown={handleServiceKeyDown} />}
          {step === 3 && <StepAgent form={form} set={set} openingPreview={openingPreview} />}
          {step === 4 && <StepKnowledge form={form} set={set} />}
          {step === 5 && <StepHours form={form} set={set} setHour={setHour} />}
          {step === 6 && <StepSources form={form} toggleSource={toggleSource} />}
          {step === 7 && <StepGoLive form={form} set={set} openingPreview={openingPreview} />}
        </div>

        {/* Footer */}
        <div className="ob-foot">
          <button
            onClick={back}
            style={{ visibility: step > 1 ? 'visible' : 'hidden', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '13px', padding: '8px 12px' }}
          >
            ← Back
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>{step} / {TOTAL_STEPS}</span>
          {step < TOTAL_STEPS ? (
            <button
              onClick={next}
              style={{ padding: '10px 20px', borderRadius: 'var(--r)', border: 'none', background: 'var(--green)', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={launch}
              disabled={saving}
              style={{ padding: '10px 24px', borderRadius: 'var(--r)', border: 'none', background: saving ? 'var(--surface3)' : 'var(--green)', color: saving ? 'var(--text3)' : '#fff', fontSize: '13px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? 'Launching…' : 'Launch your AI →'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

// ---- Step header text ----
function StepHeader({ step }) {
  const HEADERS = [
    { title: 'Your business', sub: "Tell us the basics so your AI agent knows who it's representing." },
    { title: 'Services you offer', sub: 'Your AI will use these to qualify and respond to leads accurately.' },
    { title: 'Meet your AI agent', sub: "Give your agent a name and personality. Leads will talk to it." },
    { title: 'Train your AI', sub: 'Paste your pricing, FAQs, and anything your AI should know. This is your secret weapon.' },
    { title: 'Operating hours', sub: 'Your AI handles after-hours leads differently based on your schedule.' },
    { title: 'Lead sources', sub: 'Where do your customers currently find you? Pick all that apply.' },
    { title: 'Choose your plan', sub: '14-day free trial — no credit card needed.' },
  ];
  const h = HEADERS[step - 1];
  return (
    <>
      <div className="ob-title">{h.title}</div>
      <div className="ob-sub">{h.sub}</div>
    </>
  );
}

// ---- Step 1: Business ----
function StepBusiness({ form, set, user }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="field-row">
        <div className="field">
          <label>Your name</label>
          <input value={user?.name || ''} readOnly style={{ opacity: 0.6 }} />
        </div>
        <div className="field">
          <label>Business name</label>
          <input value={user?.businessName || ''} readOnly style={{ opacity: 0.6 }} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Phone / WhatsApp <span style={{ color: 'var(--red)', fontSize: '11px' }}>*</span></label>
          <input
            type="tel"
            placeholder="+1 416 555 0100"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
          />
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>Used for daily briefings and alerts</div>
        </div>
        <div className="field">
          <label>Years in business</label>
          <input
            type="number"
            placeholder="5"
            min="0"
            value={form.yearsInBusiness}
            onChange={e => set('yearsInBusiness', e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label>City / Service area <span style={{ color: 'var(--red)', fontSize: '11px' }}>*</span></label>
        <input
          placeholder="Brampton, Mississauga, GTA"
          value={form.city}
          onChange={e => set('city', e.target.value)}
        />
      </div>
      <div className="field">
        <label>Industry</label>
        <div className="ind-grid" style={{ marginTop: '7px' }}>
          {INDUSTRIES.map(item => (
            <div
              key={item.name}
              className={`ind-btn ${form.industry === item.name ? 'active' : ''}`}
              onClick={() => set('industry', item.name)}
            >
              <span className="ind-icon">{item.icon}</span>
              <span className="ind-name">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Step 2: Services ----
function StepServices({ form, set, addService, removeService, handleServiceKeyDown }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="field">
        <label>Services you offer <span style={{ color: 'var(--red)', fontSize: '11px' }}>*</span></label>
        <div className="tag-wrap">
          {form.services.map(s => (
            <span key={s} className="tag">
              {s}
              <button className="tag-remove" onClick={() => removeService(s)}>×</button>
            </span>
          ))}
          <input
            className="tag-input"
            placeholder={form.services.length === 0 ? 'Type a service and press Enter…' : 'Add another…'}
            value={form.serviceInput}
            onChange={e => set('serviceInput', e.target.value)}
            onKeyDown={handleServiceKeyDown}
          />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
          e.g. "Emergency HVAC repair", "AC installation", "Furnace tune-up"
        </div>
      </div>

      <div className="field">
        <label>Starting price or pricing note</label>
        <input
          placeholder="e.g. Diagnostics from $89 · Drain cleaning from $150"
          value={form.startingPrice}
          onChange={e => set('startingPrice', e.target.value)}
        />
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
          Your AI will mention this when leads ask about cost
        </div>
      </div>

      <div className="field">
        <label>Exact service area</label>
        <input
          placeholder="e.g. Brampton, Mississauga, Etobicoke, Oakville"
          value={form.serviceArea}
          onChange={e => set('serviceArea', e.target.value)}
        />
      </div>

      <div
        onClick={() => set('emergencyAvailable', !form.emergencyAvailable)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px', borderRadius: 'var(--r)',
          border: `1px solid ${form.emergencyAvailable ? 'var(--green)' : 'var(--border)'}`,
          background: form.emergencyAvailable ? '#f0fdf4' : 'var(--surface)',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
          background: form.emergencyAvailable ? 'var(--green)' : 'var(--surface3)',
          border: `2px solid ${form.emergencyAvailable ? 'var(--green)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {form.emergencyAvailable && <span style={{ color: '#fff', fontSize: '12px', lineHeight: 1 }}>✓</span>}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>We offer 24/7 emergency service</div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
            Your AI will advertise emergency availability to urgent leads
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Step 3: AI Agent ----
function StepAgent({ form, set, openingPreview }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="field-row">
        <div className="field">
          <label>Agent name <span style={{ color: 'var(--red)', fontSize: '11px' }}>*</span></label>
          <input
            placeholder="Alex, Sam, Jordan, Aria…"
            value={form.agentName}
            onChange={e => set('agentName', e.target.value)}
          />
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>A first name feels more human to leads</div>
        </div>
        <div className="field">
          <label>Tone</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            {TONE_OPTIONS.map(t => (
              <label key={t.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px 10px', borderRadius: '8px', border: `1px solid ${form.tone === t.value ? 'var(--green)' : 'var(--border)'}`, background: form.tone === t.value ? '#f0fdf4' : 'transparent' }}>
                <input
                  type="radio"
                  name="tone"
                  value={t.value}
                  checked={form.tone === t.value}
                  onChange={() => set('tone', t.value)}
                  style={{ accentColor: 'var(--green)', margin: 0 }}
                />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>{t.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{t.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="field">
        <label>Opening message <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '400' }}>— what your AI says first</span></label>
        <textarea
          rows={3}
          placeholder={openingPreview}
          value={form.openingMessage}
          onChange={e => set('openingMessage', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Preview */}
      <div style={{ background: 'var(--surface2)', borderRadius: 'var(--r)', padding: '14px 16px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'JetBrains Mono', monospace" }}>Preview</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', color: '#fff', fontWeight: '700' }}>
            {form.agentName.charAt(0).toUpperCase()}
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', fontSize: '13px', lineHeight: 1.5, maxWidth: '340px' }}>
            {openingPreview}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Step 4: Train AI (RAG) ----
function StepKnowledge({ form, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ padding: '12px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--r)', fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>
        🧠 This is where Matchit becomes <strong>your</strong> AI — not a generic bot. The more you fill in, the smarter your agent gets. You can update this anytime from AgentSetup.
      </div>

      <div className="field">
        <label>Your pricing</label>
        <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '6px', lineHeight: 1.5 }}>
          List your services and prices. Your AI will quote accurately instead of saying "I don't know."
        </div>
        <textarea
          className="know-area"
          rows={5}
          placeholder={`Drain cleaning: $150 flat
AC diagnostic: $89
Furnace tune-up: $199
Emergency call-out fee: $120 (plus parts)
AC unit installation: starting at $3,500`}
          value={form.pricingKnowledge}
          onChange={e => set('pricingKnowledge', e.target.value)}
        />
      </div>

      <div className="field">
        <label>Common questions & your answers</label>
        <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '6px', lineHeight: 1.5 }}>
          What do customers always ask? Write the Q&A your AI should know by heart.
        </div>
        <textarea
          className="know-area"
          rows={5}
          placeholder={`Q: Are you licensed and insured?
A: Yes, fully licensed in Ontario and insured up to $2M liability.

Q: Do you offer warranties?
A: Yes, all our work comes with a 1-year labour warranty and manufacturer parts warranty.

Q: How quickly can you come out?
A: Same-day for emergencies, next-day for standard bookings.`}
          value={form.faqKnowledge}
          onChange={e => set('faqKnowledge', e.target.value)}
        />
      </div>

      <div className="field">
        <label>About your business & what makes you different</label>
        <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '6px', lineHeight: 1.5 }}>
          Anything you want your AI to mention when selling your business over competitors.
        </div>
        <textarea
          className="know-area"
          rows={4}
          placeholder={`We've been serving Brampton and Mississauga for 12 years. Family-owned. We use only OEM parts, not aftermarket. Our technicians are TSSA-certified. We offer free second opinions if you've already received a quote from another company. No overtime charges for emergency calls.`}
          value={form.aboutKnowledge}
          onChange={e => set('aboutKnowledge', e.target.value)}
        />
      </div>
    </div>
  );
}

// ---- Step 5: Hours ----
function StepHours({ form, set, setHour }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="hours-grid">
        {Object.keys(DEFAULT_HOURS).map(day => {
          const h = form.operatingHours[day] || DEFAULT_HOURS[day];
          return (
            <div key={day} className="day-row">
              <div className="day-name">{DAY_SHORT[day]}</div>
              <button
                onClick={() => setHour(day, 'enabled', !h.enabled)}
                className={`day-toggle ${h.enabled ? 'on' : 'off'}`}
              >
                {h.enabled ? 'Open' : 'Closed'}
              </button>
              {h.enabled ? (
                <div className="day-times">
                  <input
                    type="time"
                    className="day-time-input"
                    value={h.open}
                    onChange={e => setHour(day, 'open', e.target.value)}
                  />
                  <span style={{ color: 'var(--text3)', fontSize: '12px' }}>to</span>
                  <input
                    type="time"
                    className="day-time-input"
                    value={h.close}
                    onChange={e => setHour(day, 'close', e.target.value)}
                  />
                </div>
              ) : (
                <div className="day-times" style={{ opacity: 0.3 }}>
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Closed all day</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        onClick={() => set('emergencyAvailable', !form.emergencyAvailable)}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px', borderRadius: 'var(--r)',
          border: `1px solid ${form.emergencyAvailable ? 'var(--green)' : 'var(--border)'}`,
          background: form.emergencyAvailable ? '#f0fdf4' : 'var(--surface)',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
          background: form.emergencyAvailable ? 'var(--green)' : 'var(--surface3)',
          border: `2px solid ${form.emergencyAvailable ? 'var(--green)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {form.emergencyAvailable && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>24/7 emergency line available</div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>AI accepts emergency requests outside business hours</div>
        </div>
      </div>
    </div>
  );
}

// ---- Step 6: Sources ----
function StepSources({ form, toggleSource }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="src-grid">
        {SOURCES.map(src => (
          <div
            key={src.name}
            className={`src-btn ${form.selectedSources.includes(src.name) ? 'active' : ''}`}
            onClick={() => toggleSource(src.name)}
          >
            <div className="src-check">{form.selectedSources.includes(src.name) ? '✓' : ''}</div>
            <span className="src-icon">{src.icon}</span>
            <span className="src-label">{src.name}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--text3)', lineHeight: 1.6 }}>
        💡 You can connect and configure each source in <strong>Integrations</strong> after setup. Select all that apply for now — even ones you want to add later.
      </div>
    </div>
  );
}

// ---- Step 7: Go Live ----
function StepGoLive({ form, set, openingPreview }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Plan cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PLANS.map(plan => (
          <div
            key={plan.id}
            onClick={() => set('subscriptionTier', plan.id)}
            style={{
              padding: '14px 16px', borderRadius: 'var(--r)', cursor: 'pointer',
              border: `1.5px solid ${form.subscriptionTier === plan.id ? 'var(--green)' : 'var(--border)'}`,
              background: form.subscriptionTier === plan.id ? '#f0fdf4' : 'var(--surface)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{plan.name}</span>
                {plan.popular && (
                  <span style={{ background: 'var(--green)', color: '#fff', fontSize: '9px', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>Popular</span>
                )}
              </div>
              <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '20px', fontWeight: '700' }}>
                {plan.price}<span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text3)' }}>/mo</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {plan.features.map(f => (
                <span key={f} style={{ fontSize: '11px', color: 'var(--text2)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: '20px' }}>{f}</span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text3)' }}>14-day free trial — no credit card needed · Cancel anytime</div>
      </div>

      {/* Google review link */}
      <div className="field">
        <label>Google review link <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '400' }}>— optional but highly recommended</span></label>
        <input
          placeholder="https://g.page/r/your-business-link"
          value={form.googleReviewLink}
          onChange={e => set('googleReviewLink', e.target.value)}
        />
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
          Your AI will text this link to customers after completed jobs to collect reviews automatically
        </div>
      </div>

      {/* AI preview */}
      <div style={{ background: 'var(--surface2)', borderRadius: 'var(--r)', padding: '16px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'JetBrains Mono', monospace" }}>
          How your first lead will be greeted
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px', color: '#fff', fontWeight: '700' }}>
            {(form.agentName || 'A').charAt(0).toUpperCase()}
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px 12px 12px 2px', padding: '12px 16px', fontSize: '13px', lineHeight: 1.6, flex: 1 }}>
            {openingPreview}
          </div>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {form.services.slice(0, 4).map(s => (
            <span key={s} style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 10px', borderRadius: '20px' }}>{s}</span>
          ))}
          {form.emergencyAvailable && (
            <span style={{ fontSize: '11px', background: '#fef2f2', color: 'var(--red)', padding: '2px 10px', borderRadius: '20px' }}>🔴 24/7 emergency</span>
          )}
        </div>
      </div>

    </div>
  );
}
