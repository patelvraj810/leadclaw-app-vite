import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-dot"></div>
          LeadClaw
        </div>
        <div className="nav-links hidden-mobile">
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#industries">Industries</a>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost" onClick={() => navigate('/app/dashboard')}>Sign in</Button>
          <Button onClick={() => navigate('/onboarding')}>Start free trial</Button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <div className="hero-badge-dot"></div>
          85% of homeowners call the next company after voicemail
        </div>
        <h1>Stop losing jobs<br /><em>to voicemail</em></h1>
        <p className="hero-sub">
          Every missed call while you're on-site is a job going to your competitor. LeadClaw's AI answers instantly, qualifies the lead, and books the appointment — 24/7, while you work.
        </p>
        <div className="hero-ctas">
          <Button size="lg" onClick={() => navigate('/onboarding')}>Start free — 14 days</Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/app/dashboard')}>
            See the dashboard →
          </Button>
        </div>
        <p className="hero-note"><strong>No credit card required.</strong> Set up in 10 minutes.</p>
      </section>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-num">85%</span>
          <span className="stat-label">of homeowners call the next company after reaching voicemail once</span>
        </div>
        <div className="stat-item" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
          <span className="stat-num">28%</span>
          <span className="stat-label">of service calls are missed while the owner is on-site at another job</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">&lt;60s</span>
          <span className="stat-label">average LeadClaw response time — every lead, every time, 24/7</span>
        </div>
      </div>

      <section className="section" id="how-it-works">
        <div style={{ textAlign: 'center' }}>
          <div className="section-badge">How it works</div>
          <h2>Your new front desk works 24/7</h2>
        </div>
        <div className="steps">
          <div className="step">
            <span className="step-num">01. Connect</span>
            <h3>Connect your channels</h3>
            <p>Link your website contact form, email, or WhatsApp. Takes 2 minutes to set up.</p>
          </div>
          <div className="step">
            <span className="step-num">02. AI engages</span>
            <h3>Instant AI response</h3>
            <p>When a lead reaches out, your AI agent responds in seconds, asking your preset qualifying questions.</p>
          </div>
          <div className="step">
            <span className="step-num">03. You get booked</span>
            <h3>Jobs booked automatically</h3>
            <p>Qualified leads get your booking link. You wake up or finish a job to see new appointments in your calendar.</p>
          </div>
        </div>
        
        <div className="demo-card">
          <div className="demo-head">
            <div className="demo-av">A</div>
            <div>
              <div className="demo-agent-name">Alex — HVAC Agent</div>
              <div className="demo-agent-sub">
                <span style={{ width: '6px', height: '6px', background: 'var(--green)', borderRadius: '50%' }}></span>
                Online · Responds instantly
              </div>
            </div>
          </div>
          <div className="demo-msgs">
            <div className="dmsg dmsg-lead" style={{ animation: 'fadeUp .4s ease forwards', animationDelay: '0s', opacity: 0 }}>
              Hi, my AC stopped working and it's leaking water. Can you help?
              <div className="dmsg-time">2:14 PM · Website Form</div>
            </div>
            <div className="dmsg dmsg-agent" style={{ animation: 'fadeUp .4s ease forwards', animationDelay: '.8s', opacity: 0 }}>
              Hi there! I'm Alex from Mike's HVAC 👋 I can absolutely help with that leak. Is the unit currently running, and are you located in Brampton or Mississauga?
              <div className="dmsg-time">2:14 PM</div>
            </div>
            <div className="dmsg dmsg-lead" style={{ animation: 'fadeUp .4s ease forwards', animationDelay: '1.8s', opacity: 0 }}>
              I turned it off just in case. I'm in Mississauga.
              <div className="dmsg-time">2:16 PM</div>
            </div>
            <div className="dmsg dmsg-agent" style={{ animation: 'fadeUp .4s ease forwards', animationDelay: '2.4s', opacity: 0 }}>
              Smart move turning it off! We have an emergency technician available in Mississauga today between 4–6 PM. Our diagnostic fee is $89. Shall I book that slot for you?
              <div className="dmsg-time">2:16 PM</div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: 'var(--text3)', animation: 'fadeUp .4s ease forwards', animationDelay: '3.2s', opacity: 0 }}>
              <span className="tag tag-green">Lead qualified</span> — Appointment booked for 4:00 PM
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="industries">
        <div style={{ textAlign: 'center' }}>
          <div className="section-badge">Industries</div>
          <h2>Built for service businesses</h2>
        </div>
        <div className="industries">
          <div className="industry-card"><span className="industry-icon">❄️</span><div className="industry-name">HVAC</div><div className="industry-desc">Book emergency repairs and annual maintenance automatically.</div></div>
          <div className="industry-card"><span className="industry-icon">🔧</span><div className="industry-name">Plumbing</div><div className="industry-desc">Quote common fixes and schedule drain cleanings instantly.</div></div>
          <div className="industry-card"><span className="industry-icon">⚡</span><div className="industry-name">Electrical</div><div className="industry-desc">Qualify panel upgrades and dispatch for emergency outages.</div></div>
          <div className="industry-card"><span className="industry-icon">✨</span><div className="industry-name">Cleaning</div><div className="industry-desc">Provide instant quotes based on square footage and frequency.</div></div>
          <div className="industry-card"><span className="industry-icon">🌿</span><div className="industry-name">Landscaping</div><div className="industry-desc">Gather property details and book seasonal cleanups.</div></div>
          <div className="industry-card"><span className="industry-icon">🏠</span><div className="industry-name">Real Estate</div><div className="industry-desc">Qualify buyers, collect budgets, and arrange property viewings.</div></div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div style={{ textAlign: 'center' }}>
          <div className="section-badge">Pricing</div>
          <h2>A fraction of the cost of a receptionist</h2>
        </div>
        <div className="pricing-grid">
          <div className="plan">
            <div className="plan-name">Starter</div>
            <div className="plan-tagline">For solo operators</div>
            <div className="plan-price"><sup>$</sup>49</div>
            <div className="plan-period">per month</div>
            <ul className="plan-features">
              <li>1 AI Agent</li>
              <li>100 leads per month</li>
              <li>Email & Website integration</li>
              <li>Dashboard access</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
          <div className="plan featured">
            <div className="plan-pop">Most Popular</div>
            <div className="plan-name" style={{ color: '#fff' }}>Pro</div>
            <div className="plan-tagline" style={{ opacity: .8 }}>For growing teams</div>
            <div className="plan-price" style={{ color: '#fff' }}><sup>$</sup>99</div>
            <div className="plan-period" style={{ opacity: .8 }}>per month</div>
            <ul className="plan-features" style={{ color: '#fff' }}>
              <li>Multiple AI Agents</li>
              <li>500 leads per month</li>
              <li>WhatsApp integration</li>
              <li>Calendar booking</li>
              <li>Custom behaviour rules</li>
            </ul>
            <Button fullWidth style={{ background: '#fff', color: 'var(--text)' }} onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
          <div className="plan">
            <div className="plan-name">Premium</div>
            <div className="plan-tagline">For high-volume fleets</div>
            <div className="plan-price"><sup>$</sup>199</div>
            <div className="plan-period">per month</div>
            <ul className="plan-features">
              <li>Unlimited AI Agents</li>
              <li>2,000 leads per month</li>
              <li>AI Voice Calls (inbound/outbound)</li>
              <li>CRM Integrations (Jobber, ServiceTitan)</li>
              <li>Priority support</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-logo"><span style={{ color: 'var(--green)' }}>●</span> LeadClaw</div>
        <div className="footer-note">© 2026 LeadClaw Inc. All rights reserved.</div>
      </footer>
    </>
  );
}
