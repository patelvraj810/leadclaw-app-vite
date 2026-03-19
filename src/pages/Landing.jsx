import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Menu, X } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="logo">
          <div className="logo-dot"></div>
          LeadClaw
        </div>
        <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#how" onClick={() => setIsMenuOpen(false)}>How it works</a>
          <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
          <a href="#industries" onClick={() => setIsMenuOpen(false)}>Industries</a>
          <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', width: '100%' }}>
            <Button variant="ghost" fullWidth onClick={() => navigate('/app/dashboard')}>Sign in</Button>
            <Button fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="hidden-mobile" style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" onClick={() => navigate('/app/dashboard')}>Sign in</Button>
            <Button onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
          <button className="menu-toggle mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span style={{width:'6px',height:'6px',background:'var(--green)',borderRadius:'50%',display:'inline-block',marginRight:'8px'}}></span>
          85% of homeowners call the next company after voicemail
        </div>
        <h1>Your AI sales team.<br /><em>Always on. Always closing.</em></h1>
        <p className="hero-sub">
          LeadClaw finds leads, qualifies them, handles objections, and books the job — across every channel — while you're busy doing the actual work.
        </p>
        <div className="hero-ctas">
          <Button size="lg" onClick={() => navigate('/onboarding')}>Start free — 14 days</Button>
          <Button variant="ghost" size="lg" className="hero-cta-secondary" onClick={() => navigate('/app/dashboard')}>
            See the dashboard →
          </Button>
        </div>
        <p className="hero-note"><strong>No credit card.</strong> Set up in 10 minutes. Cancel anytime.</p>
      </section>

      <div className="stats">
        <div className="stat-item"><span className="stat-num">85%</span><span className="stat-label">of homeowners call the next company after reaching voicemail once</span></div>
        <div className="stat-item"><span className="stat-num">8+</span><span className="stat-label">lead sources connected — website, ads, Facebook, Instagram, and more</span></div>
        <div className="stat-item"><span className="stat-num">&lt;60s</span><span className="stat-label">AI response time — every lead, every channel, 24/7</span></div>
      </div>

      {/* LEAD SOURCES */}
      <div className="lsection">
        <div className="badge">Lead sources</div>
        <h2>You choose where<br />leads come from.</h2>
        <div className="ls-grid">
          <div className="ls-card"><span className="ls-icon">🌐</span><div className="ls-name">Website Form</div><div className="ls-desc">Paste one webhook URL. Every form submission triggers your AI instantly.</div><div className="ls-tag"><span className="tag tag-green">All plans</span></div></div>
          <div className="ls-card"><span className="ls-icon">📢</span><div className="ls-name">Google Ads</div><div className="ls-desc">Connect your account. Leads from your ads flow straight to the AI — no delay.</div><div className="ls-tag"><span className="tag tag-blue">Pro+</span></div></div>
          <div className="ls-card"><span className="ls-icon">📘</span><div className="ls-name">Facebook Ads</div><div className="ls-desc">Lead form ads connect directly. AI responds before the person closes the tab.</div><div className="ls-tag"><span className="tag tag-blue">Pro+</span></div></div>
          <div className="ls-card" style={{borderColor:'#ddd6fe',backgroundColor:'#faf5ff'}}><span className="ls-icon">👥</span><div className="ls-name">Facebook Groups</div><div className="ls-desc">AI monitors local groups, comments helpfully, then DMs interested people. Fully automated hunting.</div><div className="ls-tag"><span className="tag tag-purple">Premium</span></div></div>
          <div className="ls-card" style={{borderColor:'#ddd6fe',backgroundColor:'#faf5ff'}}><span className="ls-icon">📸</span><div className="ls-name">Instagram DMs</div><div className="ls-desc">AI responds to story replies and DMs — qualifies and books without you touching a phone.</div><div className="ls-tag"><span className="tag tag-purple">Premium</span></div></div>
          <div className="ls-card"><span className="ls-icon">⭐</span><div className="ls-name">Google Maps Alerts</div><div className="ls-desc">Monitor competitor reviews mentioning "slow response" — those are your leads.</div><div className="ls-tag"><span className="tag tag-blue">Pro+</span></div></div>
          <div className="ls-card"><span className="ls-icon">🏠</span><div className="ls-name">LeadClaw Directory</div><div className="ls-desc">Listed on LeadClaw.io/find — homeowners search, your AI agent answers.</div><div className="ls-tag"><span className="tag tag-green">All plans</span></div></div>
          <div className="ls-card"><span className="ls-icon">🏗</span><div className="ls-name">Angi / HomeStars / Houzz</div><div className="ls-desc">Scrape and respond to quote requests before competitors even see them.</div><div className="ls-tag"><span className="tag tag-purple">Premium</span></div></div>
          <div className="ls-card"><span className="ls-icon">📋</span><div className="ls-name">Manual Import</div><div className="ls-desc">Upload a CSV, paste a list. AI starts working every contact immediately.</div><div className="ls-tag"><span className="tag tag-green">All plans</span></div></div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="lsection" style={{paddingTop:0}} id="how">
        <div className="badge">How it works</div>
        <h2>Set up once.<br />Convert forever.</h2>
        <div className="steps3">
          <div className="step"><span className="step-num">01</span><h3>Lead comes in</h3><p>From any source — form, ad, Facebook group, Instagram. LeadClaw catches it instantly regardless of channel.</p></div>
          <div className="step"><span className="step-num">02</span><h3>AI switches mode & sells</h3><p>Agent detects context — inbound vs outbound, warm vs cold — and picks the right sales approach. Not a FAQ bot. An actual closer.</p></div>
          <div className="step"><span className="step-num">03</span><h3>You just show up</h3><p>You get a notification: "Sarah, 2pm Thursday, AC repair, $89 deposit paid." Everything else was handled while you were on another job.</p></div>
        </div>

        {/* DEMO CHAT */}
        <div className="demo-card">
          <div className="demo-head">
            <div className="demo-av">A</div>
            <div>
              <div style={{fontSize:'13px',fontWeight:500}}>Alex — AI Sales Agent for Mike's HVAC</div>
              <div style={{fontSize:'11px',color:'var(--text3)',display:'flex',alignItems:'center',gap:'5px'}}><span style={{width:'5px',height:'5px',background:'var(--green)',borderRadius:'50%',display:'inline-block'}}></span>Online · Qualifier mode active</div>
            </div>
            <div style={{marginLeft:'auto'}}><span className="mode-pill mode-qualifier">🎯 Qualifier</span></div>
          </div>
          <div className="demo-msgs">
            <div style={{textAlign:'center'}}><span className="tag tag-gray" style={{fontSize:'11px'}}>New lead from Facebook Group "Brampton Homeowners" · 11:47 PM</span></div>
            <div className="dmsg dm-lead" style={{alignSelf:'flex-end'}}>Hi, my AC stopped working and it's really hot. Do you do emergency repairs?</div>
            <div>
              <div className="dmsg dm-agent">Hi! I'm Alex from Mike's HVAC 👋 Yes, 24/7 emergency repairs — that's our thing. Before I check availability, quick question: is the unit not turning on at all, or is it running but not cooling?</div>
              <div className="dm-time">Responded in 19 seconds · SPIN qualifying</div>
            </div>
            <div className="dmsg dm-lead" style={{alignSelf:'flex-end'}}>Running but not cooling. 3 year old Carrier central AC.</div>
            <div className="dmsg dm-agent">Classic refrigerant or compressor issue on a Carrier — Mike's team sees this weekly and usually resolves it same visit. Emergency diagnostic is $89, applied to the repair cost. You available today 2–5 PM or tomorrow morning?</div>
            <div className="dmsg dm-lead" style={{alignSelf:'flex-end'}}>Today 2-5 works! How do I confirm?</div>
            <div style={{marginLeft:0}}><span className="mode-pill mode-closer" style={{marginBottom:'6px',display:'inline-flex'}}>💰 Closer mode</span></div>
            <div>
              <div className="dmsg dm-agent">Perfect — I've got you down for today 2–5 PM. Drop your address and I'll lock it in. Mike will call 30 mins before arriving. Want to put down a $25 hold so the slot is secured? 🙌</div>
              <div className="dm-time">Lead qualified · Appointment ready · Upsell attempt · Owner notified</div>
            </div>
          </div>
        </div>
      </div>

      {/* AGENT MODES */}
      <div className="lsection" style={{paddingTop:0}}>
        <div className="badge">AI Sales Intelligence</div>
        <h2>4 sales modes.<br />Zero manual effort.</h2>
        <div className="modes-grid">
          <div className="mode-card hunter"><span className="mode-icon">🎣</span><div className="mode-name">Hunter</div><div className="mode-desc">Finds leads proactively in Facebook Groups, review sites, competitor mentions. Comments helpfully, then DMs interested prospects.</div></div>
          <div className="mode-card qualifier"><span className="mode-icon">🎯</span><div className="mode-name">Qualifier</div><div className="mode-desc">Uses SPIN selling — uncovers situation, problem, implication, need. Makes the prospect realise they need help before the agent offers it.</div></div>
          <div className="mode-card closer"><span className="mode-icon">💰</span><div className="mode-name">Closer</div><div className="mode-desc">Creates urgency. Handles the 8 most common objections for your industry. Pushes for the booking or deposit — knows when to discount, when to hold.</div></div>
          <div className="mode-card nurturer"><span className="mode-icon">🌱</span><div className="mode-name">Nurturer</div><div className="mode-desc">Re-engages cold leads at day 1, 3, 7, 14 with a different angle each time. Not "just following up" — a new hook, a seasonal offer, a relevant tip.</div></div>
        </div>
      </div>

      {/* INDUSTRIES */}
      <div className="lsection" style={{paddingTop:0}} id="industries">
        <div className="badge">Industries</div>
        <h2>Built for service<br />businesses like yours</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
          <div className="ls-card"><span className="ls-icon">🏠</span><div className="ls-name">Real Estate</div><div className="ls-desc">Qualify buyers and sellers, book showings, re-engage old enquiries automatically.</div></div>
          <div className="ls-card"><span className="ls-icon">❄️</span><div className="ls-name">HVAC</div><div className="ls-desc">Never miss an emergency call. AI handles after-hours leads and books same-day visits.</div></div>
          <div className="ls-card"><span className="ls-icon">🔧</span><div className="ls-name">Plumbing</div><div className="ls-desc">Capture urgent repair leads 24/7. Pre-qualify jobs before sending a tech out.</div></div>
          <div className="ls-card"><span className="ls-icon">✨</span><div className="ls-name">Cleaning</div><div className="ls-desc">Convert quote requests into recurring clients with automated follow-up sequences.</div></div>
          <div className="ls-card"><span className="ls-icon">🌿</span><div className="ls-name">Landscaping</div><div className="ls-desc">Handle seasonal rushes without missing a lead. Every quote request answered instantly.</div></div>
          <div className="ls-card"><span className="ls-icon">⚡</span><div className="ls-name">Electrical</div><div className="ls-desc">Book emergency and planned service calls while you're on-site — without lifting a finger.</div></div>
        </div>
      </div>

      {/* PRICING */}
      <div className="lsection" style={{paddingTop:0}} id="pricing">
        <div className="badge">Pricing</div>
        <h2>Simple pricing.<br />Profitable from day 1.</h2>
        <div className="pricing-grid">
          <div className="plan">
            <div className="plan-name">Starter</div><div className="plan-sub">For solo operators</div>
            <div className="plan-price"><sup>$</sup>49</div><div className="plan-period">per month</div>
            <ul className="plan-features">
              <li>AI sales agent via email</li><li>Website form webhook</li><li>100 leads/month</li>
              <li>Lead dashboard</li><li>Conversation history</li><li>LeadClaw directory listing</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
          <div className="plan featured">
            <div className="plan-pop">Most popular</div>
            <div className="plan-name">Pro</div><div className="plan-sub">For growing businesses</div>
            <div className="plan-price"><sup>$</sup>99</div><div className="plan-period">per month</div>
            <ul className="plan-features">
              <li>Everything in Starter</li><li>WhatsApp + Instagram DMs</li>
              <li>Google Ads integration</li><li>Facebook Ads integration</li>
              <li>Google Maps monitoring</li><li>500 leads/month</li>
              <li>Lead scoring + insights</li><li>Cal.com booking integration</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
          <div className="plan">
            <div className="plan-name">Premium</div><div className="plan-sub">Full AI Sales OS</div>
            <div className="plan-price"><sup>$</sup>199</div><div className="plan-period">per month</div>
            <ul className="plan-features">
              <li>Everything in Pro</li><li>Facebook Group hunting</li>
              <li>Angi / HomeStars / Houzz</li><li>AI voice calls</li>
              <li>Unlimited leads</li><li>Done-for-you outreach</li>
              <li>Managed ad campaigns</li><li>White-label option</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/onboarding')}>Start free trial</Button>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="lsection" style={{paddingTop:0}}>
        <div className="badge">Case studies</div>
        <h2>Real businesses.<br />Real results.</h2>
        <div className="testi-grid">
          <div className="testi"><div className="testi-stars">★★★★★</div><div className="testi-text">"I was losing 3–4 emergency calls a week while on jobs. LeadClaw paid for itself in the first week. Booked a $1,400 AC install from a lead that came in at 11pm."</div><div className="testi-author"><div className="testi-av" style={{background:'#7c3aed'}}>DM</div><div><div className="testi-name">Dave Miller</div><div className="testi-biz">Miller's HVAC · Brampton, ON</div></div></div></div>
          <div className="testi"><div className="testi-stars">★★★★★</div><div className="testi-text">"My wife used to answer inquiry emails at night. Now LeadClaw handles everything — we went from 6 quotes a week to 11. Set up took 20 minutes."</div><div className="testi-author"><div className="testi-av" style={{background:'#16a34a'}}>TN</div><div><div className="testi-name">Tony Nguyen</div><div className="testi-biz">Clear Clean Co · Toronto, ON</div></div></div></div>
          <div className="testi"><div className="testi-stars">★★★★★</div><div className="testi-text">"The Facebook Groups feature is insane. My agent found 8 people asking for AC recommendations last week and booked 3 of them. I didn't do a thing."</div><div className="testi-author"><div className="testi-av" style={{background:'#2563eb'}}>SR</div><div><div className="testi-name">Sandra Reid</div><div className="testi-biz">Reid Realty Group · Mississauga, ON</div></div></div></div>
        </div>
        <div style={{textAlign:'center',marginTop:'24px',padding:'20px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--rl)'}}>
          <div style={{fontFamily:'"Clash Display", sans-serif',fontSize:'20px',fontWeight:700,marginBottom:'5px'}}>Join 340+ service businesses already using LeadClaw</div>
          <div style={{fontSize:'13px',color:'var(--text3)',marginBottom:'16px'}}>Built with LeadClaw. Sold with LeadClaw. The platform sells itself.</div>
          <Button size="lg" onClick={() => navigate('/onboarding')}>Start your 14-day free trial →</Button>
        </div>
      </div>

      {/* FAQ */}
      <div className="lsection" style={{paddingTop:0}}>
        <div className="badge">FAQ</div>
        <h2>Common questions</h2>
        <div className="faq-grid">
          <div className="faq-item"><div className="faq-q">How fast does the AI respond?</div><div className="faq-a">Under 60 seconds for every lead, every channel. Average is 34 seconds. Works 24/7 including nights and weekends.</div></div>
          <div className="faq-item"><div className="faq-q">Does it sound like a robot?</div><div className="faq-a">No. You name it, set its tone, and give it your business's voice. Customers often don't realise they're talking to AI.</div></div>
          <div className="faq-item"><div className="faq-q">How does Facebook Groups work?</div><div className="faq-a">The AI monitors groups you specify, posts helpful comments on relevant posts, then DMs people who engage — always leading with value, never spamming.</div></div>
          <div className="faq-item"><div className="faq-q">Can I take over a conversation?</div><div className="faq-a">Yes — any time. Type a manual message and it overrides the AI for that thread. You're always in control.</div></div>
          <div className="faq-item"><div className="faq-q">What channels does it work on?</div><div className="faq-a">Email, WhatsApp, Instagram DMs, Facebook Messenger, SMS (via Twilio), and AI voice calls on Premium.</div></div>
          <div className="faq-item"><div className="faq-q">How long does setup take?</div><div className="faq-a">Under 10 minutes. Enter your details, name your agent, connect your first lead source. Live same day.</div></div>
        </div>
      </div>

      <footer>
        <div style={{fontFamily:'"Clash Display", sans-serif',fontSize:'17px',fontWeight:700}}>LeadClaw</div>
        <div style={{fontSize:'13px',color:'var(--text3)'}}>© 2026 LeadClaw · AI Sales OS for Service Businesses</div>
        <div style={{display:'flex',gap:'14px',marginTop:'12px'}}><a href="#" style={{fontSize:'13px',color:'var(--text3)',textDecoration:'none'}}>Privacy</a><a href="#" style={{fontSize:'13px',color:'var(--text3)',textDecoration:'none'}}>Terms</a></div>
      </footer>
    </>
  );
}
