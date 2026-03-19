import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [ind, setInd] = useState('');
  const [plan, setPlan] = useState('pro');
  const [firstName, setFirstName] = useState('');

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else {
      // Save user to localStorage mock for dashboard
      localStorage.setItem('leadclaw_user', firstName || 'Mike');
      navigate('/app/dashboard');
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <div className="ob-header">
          <div className="ob-dots">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                className={`ob-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}
              ></div>
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="ob-step-label">1 of 5</div>
              <div className="ob-title">Let's get started</div>
              <div className="ob-sub">Create your account in seconds.</div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="ob-step-label">2 of 5</div>
              <div className="ob-title">Your business</div>
              <div className="ob-sub">This helps your AI agent answer correctly.</div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="ob-step-label">3 of 5</div>
              <div className="ob-title">Name your AI agent</div>
              <div className="ob-sub">Your AI uses this name when talking to leads.</div>
            </>
          )}
          {step === 4 && (
            <>
              <div className="ob-step-label">4 of 5</div>
              <div className="ob-title">Choose your lead sources</div>
              <div className="ob-sub">Where should your AI look for leads?</div>
            </>
          )}
          {step === 5 && (
            <>
              <div className="ob-step-label">5 of 5</div>
              <div className="ob-title">Choose your plan</div>
              <div className="ob-sub">14-day free trial — no credit card required.</div>
            </>
          )}
        </div>

        <div className="ob-body">
          {step === 1 && (
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
          )}
          
          {step === 2 && (
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
                <label>City / service area</label>
                <input placeholder="Brampton, ON" />
              </div>
              <div className="field">
                <label>Industry</label>
                <div className="ind-grid" style={{ marginTop: '8px' }}>
                  {[
                    {id: 'hvac', icon: '❄️', name: 'HVAC', desc: 'Heating & cooling'},
                    {id: 're', icon: '🏠', name: 'Real Estate', desc: 'Buy & sell homes'},
                    {id: 'clean', icon: '✨', name: 'Cleaning', desc: 'Home & commercial'},
                    {id: 'plumb', icon: '🔧', name: 'Plumbing', desc: 'Repairs & installs'},
                    {id: 'land', icon: '🌿', name: 'Landscaping', desc: 'Gardens & lawns'},
                    {id: 'other', icon: '⚙️', name: 'Other', desc: 'Any service biz'},
                  ].map(item => (
                    <div 
                      key={item.id} 
                      className={`ind-btn ${ind === item.id ? 'active' : ''}`}
                      onClick={() => setInd(item.id)}
                    >
                      <span className="ind-icon">{item.icon}</span>
                      <span className="ind-name">{item.name}</span>
                      <span className="ind-desc">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="field">
                <label>Agent name</label>
                <input placeholder="Alex, Sam, Jordan..." defaultValue="Alex" />
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>
                  Tip: a first name feels more personal
                </div>
              </div>
              <div className="field">
                <label>Services you offer (one per line)</label>
                <textarea 
                  placeholder="Emergency HVAC repair&#10;AC installation&#10;Heating system maintenance"
                  defaultValue="Emergency HVAC repair\nAC installation\nHeating system maintenance"
                ></textarea>
              </div>
              <div className="field">
                <label>Starting price</label>
                <input placeholder="e.g. Services start from $89" />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="field">
                <label>Connect integrations (You can add more later)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>Website Form</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Webhooks and email forwarding</div>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', cursor: 'pointer' }}>
                    <input type="checkbox" />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>Facebook & IG Comments</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Auto-DM people who comment on your posts</div>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', cursor: 'pointer' }}>
                    <input type="checkbox" />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>Google / Facebook Ads</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Instant response to Lead Gen forms</div>
                    </div>
                  </label>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: '1px solid var(--border2)', borderRadius: 'var(--r)', cursor: 'pointer' }}>
                    <input type="checkbox" />
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>Meta Cloud API (WhatsApp)</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)' }}>AI responds directly to WhatsApp inquiries</div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div 
                className={`plan-sel ${plan === 'starter' ? 'active' : ''}`} 
                onClick={() => setPlan('starter')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>Starter</div>
                    <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Email only · 100 leads/month</div>
                  </div>
                  <div style={{ fontFamily: '"Clash Display", sans-serif', fontSize: '22px', fontWeight: '700' }}>
                    $49<span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text3)' }}>/mo</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`plan-sel ${plan === 'pro' ? 'active' : ''}`} 
                onClick={() => setPlan('pro')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '600' }}>Pro</div>
                      <span style={{ background: 'var(--green)', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>
                        Popular
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Email + WhatsApp · 500 leads</div>
                  </div>
                  <div style={{ fontFamily: '"Clash Display", sans-serif', fontSize: '22px', fontWeight: '700' }}>
                    $99<span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text3)' }}>/mo</span>
                  </div>
                </div>
              </div>
              
              <div 
                className={`plan-sel ${plan === 'premium' ? 'active' : ''}`} 
                onClick={() => setPlan('premium')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>Premium</div>
                    <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Email + WhatsApp + AI Calls</div>
                  </div>
                  <div style={{ fontFamily: '"Clash Display", sans-serif', fontSize: '22px', fontWeight: '700' }}>
                    $199<span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text3)' }}>/mo</span>
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text3)', marginTop: '10px' }}>
                Cancel anytime · No credit card needed
              </div>
            </>
          )}
        </div>

        <div className="ob-footer">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
          >
            ← Back
          </Button>
          <span style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: '"JetBrains Mono", monospace' }}>
            {step} of 5
          </span>
          <Button onClick={nextStep}>
            {step === 5 ? 'Start free trial →' : 'Continue →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
