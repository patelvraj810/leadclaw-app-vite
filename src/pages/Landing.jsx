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
          LeadClaw v2 is here: Autonomous Sales Reps
        </div>
        <h1>Stop losing jobs<br /><em>to a slow response</em></h1>
        <p className="hero-sub">
          LeadClaw's AI replies in seconds, qualifies intent, handles objections, and takes deposits. It works Facebook groups, crushes DMs, and books your calendar 24/7.
        </p>
        <div className="hero-ctas">
          <Button size="lg" onClick={() => navigate('/onboarding')}>Hire your AI agent — Free Trial</Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/app/dashboard')}>
            See the dashboard →
          </Button>
        </div>
        <p className="hero-note"><strong>No credit card required.</strong> Live in 10 minutes.</p>
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
              <div className="demo-agent-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Alex — HVAC Agent
                <span className="mode-pill mode-closer">Closer Mode</span>
              </div>
              <div className="demo-agent-sub">
                <span style={{ width: '6px', height: '6px', background: 'var(--green)', borderRadius: '50%' }}></span>
                Online · Responds instantly
              </div>
            </div>
          </div>
          <div className="demo-msgs">
            <div className="dmsg dmsg-lead" style={{ animation: 'fadeUp .4s ease forwards', animationDelay: '0s', opacity: 0 }}>
              Hi, my AC stopped working and it's leaking water. Can you help?
              <div className="dmsg-time">2:14 PM · 🌐 Website Form</div>
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
              Smart move turning it off! We have an emergency technician available in Mississauga today between 4–6 PM. Our dispatch fee is $89 which gets waived if you proceed with repairs. I just sent a secure link to your email to lock in this slot.
              <div className="dmsg-time">2:16 PM</div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: 'var(--text3)', animation: 'fadeUp .4s ease forwards', animationDelay: '3.2s', opacity: 0 }}>
              <span className="tag tag-green">Deposit paid</span> — $89.00 received. Appointment booked for 4:00 PM
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="sales-modes">
        <div style={{ textAlign: 'center' }}>
          <div className="section-badge">4 Sales Modes</div>
          <h2>One agent, four distinct mindsets</h2>
        </div>
        <div className="industries">
          <div className="industry-card" style={{ background: '#fef9ec', borderColor: '#fde68a' }}>
            <span className="industry-icon">🏹</span>
            <div className="industry-name" style={{ color: '#d97706' }}>Hunter Mode</div>
            <div className="industry-desc">Monitors Facebook Groups and targets DMs to generate completely new inbound flow.</div>
          </div>
          <div className="industry-card" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <span className="industry-icon">🎯</span>
            <div className="industry-name" style={{ color: '#2563eb' }}>Qualifier Mode</div>
            <div className="industry-desc">Filters tire-kickers by gathering budgets, addresses, and images before passing to humans.</div>
          </div>
          <div className="industry-card" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
            <span className="industry-icon">💼</span>
            <div className="industry-name" style={{ color: '#7c3aed' }}>Closer Mode</div>
            <div className="industry-desc">Uses SPIN selling tactics to handle objections and explicitly pushes for a deposit/booking.</div>
          </div>
          <div className="industry-card" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
            <span className="industry-icon">🌱</span>
            <div className="industry-name" style={{ color: '#64748b' }}>Nurturer Mode</div>
            <div className="industry-desc">Runs 14-day re-engagement campaigns on cold leads with tailored angles.</div>
          </div>
        </div>
      </section>

      <section className="section" id="sources">
        <div style={{ textAlign: 'center' }}>
          <div className="section-badge">Connect everywhere</div>
          <h2>Be where your customers are</h2>
        </div>
        <div className="industries" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
           <div className="industry-card" style={{ padding: '16px', textAlign: 'center' }}><span className="industry-icon">🌐</span><div className="industry-name">Website Forms</div></div>
           <div className="industry-card" style={{ padding: '16px', textAlign: 'center' }}><span className="industry-icon">💬</span><div className="industry-name">WhatsApp</div></div>
           <div className="industry-card" style={{ padding: '16px', textAlign: 'center' }}><span className="industry-icon">📸</span><div className="industry-name">Instagram DMs</div></div>
           <div className="industry-card" style={{ padding: '16px', textAlign: 'center' }}><span className="industry-icon">👥</span><div className="industry-name">Facebook Groups</div></div>
           <div className="industry-card" style={{ padding: '16px', textAlign: 'center' }}><span className="industry-icon">📢</span><div className="industry-name">Google Ads</div></div>
           <div className="industry-card" style={{ padding: '16px', textAlign: 'center' }}><span className="industry-icon">📘</span><div className="industry-name">Facebook Ads</div></div>
           <div className="industry-card" style={{ padding: '16px', textAlign: 'center' }}><span className="industry-icon">⭐</span><div className="industry-name">Google Reviews</div></div>
           <div className="industry-card" style={{ padding: '16px', textAlign: 'center' }}><span className="industry-icon">🏠</span><div className="industry-name">LeadClaw Directory</div></div>
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
            <div className="plan-tagline">Qualifier Mode only</div>
            <div className="plan-price"><sup>$</sup>49</div>
            <div className="plan-period">per month</div>
            <ul className="plan-features">
              <li>1 AI Agent (Qualifier)</li>
              <li>100 leads per month</li>
              <li>Email & Website integration</li>
              <li>Dashboard access</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
          <div className="plan featured">
            <div className="plan-pop">Most Popular</div>
            <div className="plan-name" style={{ color: '#fff' }}>Pro</div>
            <div className="plan-tagline" style={{ opacity: .8 }}>All 4 Sales Modes</div>
            <div className="plan-price" style={{ color: '#fff' }}><sup>$</sup>99</div>
            <div className="plan-period" style={{ opacity: .8 }}>per month</div>
            <ul className="plan-features" style={{ color: '#fff' }}>
              <li>Multiple AI Agents</li>
              <li>Hunter, Closer, Nurture modes</li>
              <li>500 leads per month</li>
              <li>WhatsApp & IG integration</li>
              <li>Stripe Deposit Collection</li>
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
              <li>Facebook Groups integration</li>
              <li>CRM Integrations (Jobber, etc)</li>
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
