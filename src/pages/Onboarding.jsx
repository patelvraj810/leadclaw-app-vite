import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [ind, setInd] = useState('');
  const [plan, setPlan] = useState('pro');
  const [firstName, setFirstName] = useState('');
  const [sources, setSources] = useState(['Website form']);

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else {
      localStorage.setItem('matchit_user', firstName || 'Mike');
      navigate('/app/dashboard');
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSource = (src) => {
    if (sources.includes(src)) {
      setSources(sources.filter(s => s !== src));
    } else {
      setSources([...sources, src]);
    }
  };

  const obSteps = [
    {
      lbl: '1 of 5',
      title: "Let's get started",
      sub: 'Create your account in seconds.',
      body: (
        <>
          <div className="field-row">
            <div className="field">
              <label>First name</label>
              <input placeholder="Mike" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="field">
              <label>Last name</label>
              <input placeholder="Johnson" />
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="mike@yourbusiness.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="Choose a strong password" />
          </div>
        </>
      )
    },
    {
      lbl: '2 of 5',
      title: 'Your business',
      sub: 'This helps your AI agent answer correctly.',
      body: (
        <>
          <div className="field">
            <label>Business name</label>
            <input placeholder="Mike's HVAC" />
          </div>
          <div className="field">
            <label>Phone</label>
            <input type="tel" placeholder="+1 416 555 0100" />
          </div>
          <div className="field">
            <label>City / area</label>
            <input placeholder="Brampton, ON" />
          </div>
          <div className="field">
            <label>Industry</label>
            <div className="ind-grid" style={{ marginTop: '7px' }}>
              {[
                { name: 'HVAC', icon: '❄️', desc: 'Heating & cooling' },
                { name: 'Real Estate', icon: '🏠', desc: '' },
                { name: 'Cleaning', icon: '✨', desc: '' },
                { name: 'Plumbing', icon: '🔧', desc: '' },
                { name: 'Landscaping', icon: '🌿', desc: '' },
                { name: 'Other', icon: '⚙️', desc: '' }
              ].map(item => (
                <div
                  key={item.name}
                  className={`ind-btn ${ind === item.name ? 'active' : ''}`}
                  onClick={() => setInd(item.name)}
                >
                  <span className="ind-icon">{item.icon}</span>
                  <span className="ind-name">{item.name}</span>
                  {item.desc && <span className="ind-desc">{item.desc}</span>}
                </div>
              ))}
            </div>
          </div>
        </>
      )
    },
    {
      lbl: '3 of 5',
      title: 'Name your AI agent',
      sub: 'Your AI uses this name with every lead.',
      body: (
        <>
          <div className="field">
            <label>Agent name</label>
            <input placeholder="Alex, Sam, Jordan..." defaultValue="Alex" />
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>A first name feels more human to leads</div>
          </div>
          <div className="field">
            <label>Services (one per line)</label>
            <textarea placeholder="Emergency HVAC repair&#10;AC installation&#10;Heating maintenance"></textarea>
          </div>
          <div className="field">
            <label>Starting price</label>
            <input placeholder="e.g. Diagnostics from $89" />
          </div>
        </>
      )
    },
    {
      lbl: '4 of 5',
      title: 'Choose your lead sources',
      sub: 'Pick where you want leads to come from. You can add more later.',
      body: (
        <>
          <div className="src-grid">
            {[
              { name: 'Website form', icon: '🌐' },
              { name: 'Facebook Ads', icon: '📘' },
              { name: 'Google Ads', icon: '📢' },
              { name: 'Facebook Groups', icon: '👥' },
              { name: 'Instagram DMs', icon: '📸' },
              { name: 'Manual import', icon: '📋' }
            ].map(src => (
              <div
                key={src.name}
                className={`src-btn ${sources.includes(src.name) ? 'active' : ''}`}
                onClick={() => toggleSource(src.name)}
              >
                <div className="src-check">{sources.includes(src.name) ? '✓' : ''}</div>
                <span className="src-icon">{src.icon}</span>
                <span className="src-label">{src.name}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--surface2)', borderRadius: 'var(--r)', fontSize: '12px', color: 'var(--text3)' }}>
            💡 You can connect all sources after setup. Start with what you have today.
          </div>
        </>
      )
    },
    {
      lbl: '5 of 5',
      title: 'Choose your plan',
      sub: '14-day free trial — no credit card needed.',
      body: (
        <>
          <div className={`plan-sel ${plan === 'starter' ? 'active' : ''}`} onClick={() => setPlan('starter')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Starter</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Email · Website form · 100 leads/month</div>
              </div>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '20px', fontWeight: '700' }}>
                $49<span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text3)' }}>/mo</span>
              </div>
            </div>
          </div>
          <div
            className={`plan-sel ${plan === 'pro' ? 'active' : ''}`}
            onClick={() => setPlan('pro')}
            style={plan === 'pro' ? { borderColor: 'var(--text)', background: 'var(--surface2)' } : {}}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>Pro</div>
                  <span style={{ background: 'var(--green)', color: '#fff', fontSize: '9px', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>Popular</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>+ WhatsApp, Google Ads, Facebook Ads · 500 leads</div>
              </div>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '20px', fontWeight: '700' }}>
                $99<span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text3)' }}>/mo</span>
              </div>
            </div>
          </div>
          <div className={`plan-sel ${plan === 'premium' ? 'active' : ''}`} onClick={() => setPlan('premium')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Premium</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>+ Facebook Groups, AI Calls, Done-for-you</div>
              </div>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '20px', fontWeight: '700' }}>
                $199<span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text3)' }}>/mo</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSzie: '11px', color: 'var(--text3)', marginTop: '8px' }}>Cancel anytime · No credit card needed</div>
        </>
      )
    }
  ];

  const current = obSteps[step - 1];

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <div className="ob-head">
          <div className="ob-dots">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`ob-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}
              ></div>
            ))}
          </div>
          <div className="ob-lbl">{current.lbl}</div>
          <div className="ob-title">{current.title}</div>
          <div className="ob-sub">{current.sub}</div>
        </div>

        <div className="ob-body">
          {current.body}
        </div>

        <div className="ob-foot">
          <Button
            variant="ghost"
            onClick={prevStep}
            style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
          >
            ← Back
          </Button>
          <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>{step} of 5</span>
          <Button onClick={nextStep}>
            {step === 5 ? 'Start free trial →' : 'Continue →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
