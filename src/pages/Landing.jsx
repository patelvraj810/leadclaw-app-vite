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

      <div className="section">
        <div className="section-badge">How it works</div>
        <h2>Set up once.<br />Convert forever.</h2>
        <div className="steps">
          <div className="step"><span className="step-num">01</span><h3>A lead comes in</h3><p>Someone fills your contact form, clicks your ad, or messages your site. LeadClaw catches it in seconds.</p></div>
          <div className="step"><span className="step-num">02</span><h3>AI responds instantly</h3><p>Your AI agent introduces itself, qualifies the lead, handles objections — just like your best salesperson, available 24/7.</p></div>
          <div className="step"><span className="step-num">03</span><h3>You close the deal</h3><p>You get a notification: "Sarah needs AC repair Tuesday, knows your pricing, ready to book." You just show up.</p></div>
        </div>
        <div className="demo-card">
          <div className="demo-head">
            <div className="demo-av">A</div>
            <div>
              <div className="demo-agent-name">Alex — AI Agent for Mike's HVAC</div>
              <div className="demo-agent-sub"><span style={{width:'6px',height:'6px',background:'var(--green)',borderRadius:'50%',display:'inline-block'}}></span>Online · Responds instantly</div>
            </div>
          </div>
          <div className="demo-msgs">
            <div style={{textAlign:'center'}}><span className="tag tag-gray">New lead from Google Ads · 2:34 AM</span></div>
            <div className="dmsg dmsg-lead" style={{alignSelf:'flex-end'}}>Hi, my AC stopped working and it's really hot. Do you do emergency repairs?</div>
            <div>
              <div className="dmsg dmsg-agent">Hi! I'm Alex from Mike's HVAC 👋 We absolutely do emergency repairs — available 24/7. To get you sorted fast, what type of unit do you have? Central AC, mini-split, or window unit?</div>
              <div className="dmsg-time">Responded in 21 seconds</div>
            </div>
            <div className="dmsg dmsg-lead" style={{alignSelf:'flex-end'}}>Central AC. 3 years old. Just stopped blowing cold air.</div>
            <div className="dmsg dmsg-agent">Got it — likely a refrigerant or compressor issue, both things we handle daily. Emergency visits start at $89 diagnostic. Are you free today between 2–5 PM?</div>
            <div className="dmsg dmsg-lead" style={{alignSelf:'flex-end'}}>Yes! 2-5 works great. What's your address?</div>
            <div>
              <div className="dmsg dmsg-agent">Perfect — pencilled in for today 2–5 PM! Share your address and Mike will call 30 mins before arriving 🙌</div>
              <div className="dmsg-time">Lead qualified · Appointment booked · Owner notified</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop:0}}>
        <div className="section-badge">Industries</div>
        <h2>Built for service<br />businesses like yours</h2>
        <div className="industries">
          <div className="industry-card"><span className="industry-icon">🏠</span><div className="industry-name">Real Estate</div><div className="industry-desc">Qualify buyers and sellers, book showings, follow up with every inquiry automatically.</div></div>
          <div className="industry-card"><span className="industry-icon">❄️</span><div className="industry-name">HVAC</div><div className="industry-desc">Never miss an emergency call again. AI handles after-hours leads and books service visits instantly.</div></div>
          <div className="industry-card"><span className="industry-icon">🔧</span><div className="industry-name">Plumbing</div><div className="industry-desc">Capture urgent repair leads 24/7 and pre-qualify jobs before you send a tech.</div></div>
          <div className="industry-card"><span className="industry-icon">✨</span><div className="industry-name">Cleaning</div><div className="industry-desc">Convert quote requests into recurring clients with follow-up sequences on autopilot.</div></div>
          <div className="industry-card"><span className="industry-icon">🌿</span><div className="industry-name">Landscaping</div><div className="industry-desc">Handle seasonal rushes without missing a lead. AI responds to every quote request instantly.</div></div>
          <div className="industry-card"><span className="industry-icon">⚡</span><div className="industry-name">Electrical</div><div className="industry-desc">Book emergency and planned service calls while you're on-site — without lifting a finger.</div></div>
        </div>
      </div>

      <div className="section" style={{paddingTop:0}}>
        <div className="section-badge">Pricing</div>
        <h2>Simple pricing.<br />No surprises.</h2>
        <div className="pricing-grid">
          <div className="plan">
            <div className="plan-name">Starter</div><div className="plan-tagline">For solo operators</div>
            <div className="plan-price"><sup>$</sup>49</div><div className="plan-period">per month</div>
            <ul className="plan-features"><li>AI agent via email</li><li>100 leads/month</li><li>Lead dashboard</li><li>Conversation history</li><li>Email notifications</li></ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
          <div className="plan featured">
            <div className="plan-pop">Most popular</div>
            <div className="plan-name" style={{ color: '#fff' }}>Pro</div><div className="plan-tagline" style={{ opacity: .8 }}>For growing businesses</div>
            <div className="plan-price" style={{ color: '#fff' }}><sup>$</sup>99</div><div className="plan-period" style={{ opacity: .8 }}>per month</div>
            <ul className="plan-features" style={{ color: '#fff' }}><li>Everything in Starter</li><li>AI agent via WhatsApp</li><li>500 leads/month</li><li>Lead scoring</li><li>CRM integrations</li><li>Priority support</li></ul>
            <Button fullWidth style={{ background: '#fff', color: 'var(--text)' }} onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
          <div className="plan">
            <div className="plan-name">Premium</div><div className="plan-tagline">Full automation</div>
            <div className="plan-price"><sup>$</sup>199</div><div className="plan-period">per month</div>
            <ul className="plan-features"><li>Everything in Pro</li><li>AI voice calls</li><li>Unlimited leads</li><li>Custom AI personality</li><li>White-label option</li><li>Dedicated onboarding</li></ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
        </div>
      </div>

      <div className="section" style={{paddingTop:0}}>
        <div className="section-badge">What owners say</div>
        <h2>Real businesses.<br />Real results.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'22px'}}>
            <div style={{display:'flex',gap:'3px',marginBottom:'14px'}}>★★★★★</div>
            <div style={{fontSize:'14px',lineHeight:1.6,color:'var(--text)',marginBottom:'16px'}}>"I was losing 3-4 emergency calls a week while I was on jobs. LeadClaw paid for itself in the first week. Booked a $1,400 AC install from a lead that came in at 11pm."</div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',borderTop:'1px solid var(--border)',paddingTop:'14px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#7c3aed',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff'}}>DM</div>
              <div><div style={{fontSize:'13px',fontWeight:600}}>Dave Miller</div><div style={{fontSize:'12px',color:'var(--text3)'}}>Miller's HVAC · Brampton, ON</div></div>
            </div>
          </div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'22px'}}>
            <div style={{display:'flex',gap:'3px',marginBottom:'14px'}}>★★★★★</div>
            <div style={{fontSize:'14px',lineHeight:1.6,color:'var(--text)',marginBottom:'16px'}}>"I used to have my wife answering inquiry emails at night. Now LeadClaw handles everything. We went from 6 quotes a week to 11. Set up in like 20 minutes."</div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',borderTop:'1px solid var(--border)',paddingTop:'14px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#16a34a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff'}}>TN</div>
              <div><div style={{fontSize:'13px',fontWeight:600}}>Tony Nguyen</div><div style={{fontSize:'12px',color:'var(--text3)'}}>Clear Clean Co · Toronto, ON</div></div>
            </div>
          </div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'22px'}}>
            <div style={{display:'flex',gap:'3px',marginBottom:'14px'}}>★★★★★</div>
            <div style={{fontSize:'14px',lineHeight:1.6,color:'var(--text)',marginBottom:'16px'}}>"My AI agent qualifies buyers before I ever pick up the phone. I stopped wasting time on tire-kickers. Closed 4 deals last month that I would have missed completely."</div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',borderTop:'1px solid var(--border)',paddingTop:'14px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#2563eb',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff'}}>SR</div>
              <div><div style={{fontSize:'13px',fontWeight:600}}>Sandra Reid</div><div style={{fontSize:'12px',color:'var(--text3)'}}>Reid Realty Group · Mississauga, ON</div></div>
            </div>
          </div>
        </div>
        <div style={{textAlign:'center',marginTop:'28px',padding:'20px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)'}}>
          <div style={{fontFamily:'"Clash Display", sans-serif',fontSize:'22px',fontWeight:700,marginBottom:'6px'}}>Join 340+ service businesses already using LeadClaw</div>
          <div style={{fontSize:'14px',color:'var(--text3)',marginBottom:'18px'}}>HVAC · Plumbing · Real Estate · Cleaning · Landscaping · Electrical</div>
          <Button size="lg" onClick={() => navigate('/onboarding')}>Start your 14-day free trial →</Button>
        </div>
      </div>

      <div className="section" style={{paddingTop:0,maxWidth:'1080px',margin:'0 auto'}}>
        <div className="section-badge">FAQ</div>
        <h2>Common questions</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'20px'}}><div style={{fontSize:'14px',fontWeight:600,marginBottom:'8px'}}>How fast does the AI actually respond?</div><div style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.6}}>In under 60 seconds for every new inquiry. Average response time is 34 seconds. The AI works 24/7 — including nights, weekends, and while you're on-site.</div></div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'20px'}}><div style={{fontSize:'14px',fontWeight:600,marginBottom:'8px'}}>Does it sound like a robot?</div><div style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.6}}>No — you give your agent a name and personality. Customers often don't realise they're talking to an AI. You can set the tone: friendly, professional, energetic, or concise.</div></div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'20px'}}><div style={{fontSize:'14px',fontWeight:600,marginBottom:'8px'}}>What happens when a lead is ready to book?</div><div style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.6}}>You get a notification instantly. The AI collects their details, service needed, preferred time, and confirms the job — you review it in your dashboard and show up.</div></div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'20px'}}><div style={{fontSize:'14px',fontWeight:600,marginBottom:'8px'}}>How do leads reach the AI?</div><div style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.6}}>Via your existing website form, Google Ads lead form, or any tool that supports webhooks (Typeform, Jotform, etc.). Pro and Premium also include WhatsApp.</div></div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'20px'}}><div style={{fontSize:'14px',fontWeight:600,marginBottom:'8px'}}>Can I take over a conversation?</div><div style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.6}}>Yes, at any time. Just type a manual message and it overrides the AI for that thread. You're always in control — the AI just handles the volume you can't.</div></div>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)',padding:'20px'}}><div style={{fontSize:'14px',fontWeight:600,marginBottom:'8px'}}>How long does setup take?</div><div style={{fontSize:'13px',color:'var(--text2)',lineHeight:1.6}}>Under 10 minutes for most businesses. Enter your business details, name your agent, and connect your form. Your AI is live the same day — no technical skills needed.</div></div>
        </div>
      </div>

      <footer>
        <div className="footer-logo"><span style={{ color: 'var(--green)' }}>●</span> LeadClaw</div>
        <div className="footer-note">© 2026 LeadClaw Inc. All rights reserved.</div>
      </footer>
    </>
  );
}
