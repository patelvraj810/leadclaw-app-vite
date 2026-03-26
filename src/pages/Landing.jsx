import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Menu, X, Zap, Shield, TrendingUp, Clock } from 'lucide-react';

const PLATFORM_CARDS = [
  { title: 'Capture every lead', desc: 'Website forms, ads, WhatsApp, and Matchit Find all feed one AI-first pipeline — no more lost requests.', tone: 'emerald', icon: '📥' },
  { title: 'Qualify and quote fast', desc: 'Your AI agent responds, qualifies urgency, and drafts estimates from your price book in under a minute.', tone: 'blue', icon: '⚡' },
  { title: 'Book and dispatch', desc: 'Approved estimates become jobs. Jobs get assigned to your team. Field workflow keeps everyone aligned.', tone: 'ink', icon: '📅' },
  { title: 'Invoice and collect', desc: 'Completed work turns into invoices with Stripe payment links — revenue closes without admin drag.', tone: 'amber', icon: '💳' },
];

const OPERATING_PANELS = [
  { eyebrow: 'For owners', title: 'Stop babysitting lead response', copy: 'One place for leads, conversations, estimates, jobs, invoicing, and team activity — no more jumping between five tabs.', icon: '🎯' },
  { eyebrow: 'For dispatch', title: 'Quote to scheduled work, fast', copy: 'Approved work flows into jobs, technicians can be assigned, and the field view keeps visits moving from confirmed to complete.', icon: '🗓️' },
  { eyebrow: 'For growth', title: 'Build an AI-first service business', copy: 'Campaigns, analytics, knowledge base, and integrations all point toward one thing: more booked revenue with less overhead.', icon: '📈' },
];

const INDUSTRIES = ['HVAC', 'Plumbing', 'Electrical', 'Cleaning', 'Landscaping', 'Appliance repair', 'Roofing', 'General contracting', 'Property services'];

const HERO_SEQUENCE = ['Capture', 'Quote', 'Book', 'Dispatch', 'Get paid'];

const HERO_WORKFLOW_DEMO = {
  Capture: {
    panelLabel: 'Signal capture',
    panelTitle: 'Every demand source lands in one AI-first queue',
    signals: [
      { value: '4 channels', label: 'Website, inbox, ads, and Matchit Find feeding one pipeline' },
      { value: '< 60s', label: 'Target response speed when fresh demand hits' },
    ],
    feed: [
      { tone: 'green', title: 'Lead captured instantly', copy: 'New requests land from website forms, WhatsApp, ads, and Matchit Find without getting lost.' },
      { tone: 'blue', title: 'AI opens the thread', copy: 'Matchit starts the conversation so the customer is never waiting on manual follow-up.' },
      { tone: 'amber', title: 'Owner sees clean demand', copy: 'Instead of five disconnected tools, demand arrives in one operating view.' },
    ],
  },
  Quote: {
    panelLabel: 'AI quote workflow',
    panelTitle: 'Qualify fast and move toward a clean estimate',
    signals: [
      { value: 'Price book', label: 'Quote inputs come from the same pricing used in operations' },
      { value: '1 click', label: 'Jump from lead to estimate without re-entering details' },
    ],
    feed: [
      { tone: 'green', title: 'Urgency gets qualified', copy: 'The agent collects the context your team needs before anyone manually responds.' },
      { tone: 'blue', title: 'Estimate flow triggered', copy: 'The right opportunities move straight into draft estimates and customer-ready links.' },
      { tone: 'amber', title: 'No messy handoff', copy: 'No copy-paste between inbox, spreadsheet, and job board.' },
    ],
  },
  Book: {
    panelLabel: 'Conversion layer',
    panelTitle: 'Approved estimates turn into booked work',
    signals: [
      { value: 'Public link', label: 'Customers approve without logging into anything' },
      { value: 'Deposit ready', label: 'Deposit collection when the job needs commitment' },
    ],
    feed: [
      { tone: 'green', title: 'Customer reviews estimate', copy: 'The approval flow feels modern and branded instead of a PDF in email.' },
      { tone: 'blue', title: 'Approval becomes operational', copy: 'Approved work becomes the next step in your pipeline, not a dead-end status.' },
      { tone: 'amber', title: 'Momentum preserved', copy: 'Matchit keeps the customer journey moving toward real scheduled work.' },
    ],
  },
  Dispatch: {
    panelLabel: 'Dispatch readiness',
    panelTitle: 'Turn booked work into assigned field execution',
    signals: [
      { value: 'Team aware', label: 'Jobs assigned to real team members, not placeholders' },
      { value: 'Field view', label: 'Technicians see a clean workflow from scheduled to complete' },
    ],
    feed: [
      { tone: 'green', title: 'Job gets scheduled', copy: 'Booked work moves into jobs with dates, times, and technician assignment.' },
      { tone: 'blue', title: 'Dispatch stays organized', copy: 'Team, field, and jobs point at one source of truth.' },
      { tone: 'amber', title: 'Status stays visible', copy: 'See work move from scheduled → confirmed → in-progress → complete.' },
    ],
  },
  'Get paid': {
    panelLabel: 'Revenue close',
    panelTitle: 'Completed work flows into invoicing and payment',
    signals: [
      { value: 'Invoice ready', label: 'Finished jobs move directly into invoice creation' },
      { value: 'Stripe path', label: 'Payment-link flow for a cleaner collection experience' },
    ],
    feed: [
      { tone: 'green', title: 'Field work documented', copy: 'Completion notes keep the handoff from technician to invoice clean.' },
      { tone: 'blue', title: 'Invoice created from job', copy: 'Customer, service, and pricing context carry forward without retyping.' },
      { tone: 'amber', title: 'Revenue tracked', copy: 'Matchit closes the loop from first lead to collected payment.' },
    ],
  },
};

const TRUST_STATS = [
  { icon: <Zap size={16} />, value: '< 60s', label: 'AI response time' },
  { icon: <TrendingUp size={16} />, value: '3×', label: 'More leads converted' },
  { icon: <Clock size={16} />, value: '8 hrs', label: 'Saved per week' },
  { icon: <Shield size={16} />, value: '100%', label: 'Your data, your brand' },
];

export function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(HERO_SEQUENCE[0]);
  const closeMenu = () => setIsMenuOpen(false);
  const activeDemo = HERO_WORKFLOW_DEMO[activeStep];

  return (
    <div className="landing-page">
      {/* NAV */}
      <nav className="nav landing-nav">
        <div className="logo">
          <div className="logo-dot" />
          Matchit
        </div>
        <div className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#platform" onClick={closeMenu}>Platform</a>
          <a href="#workflow" onClick={closeMenu}>How it works</a>
          <a href="#industries" onClick={closeMenu}>Industries</a>
          <a href="#pricing" onClick={closeMenu}>Pricing</a>
          <a href="/find" onClick={closeMenu}>Find a Pro</a>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="nav-cta-desktop">
            <Button variant="ghost" onClick={() => navigate('/login')}>Sign in</Button>
            <Button onClick={() => navigate('/signup')}>Start free trial</Button>
          </div>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(v => !v)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <div className={`nav-cta-mobile ${isMenuOpen ? 'active' : ''}`}>
          <Button variant="ghost" fullWidth onClick={() => { navigate('/login'); closeMenu(); }}>Sign in</Button>
          <Button fullWidth onClick={() => { navigate('/signup'); closeMenu(); }}>Start free trial</Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid landing-hero-grid">
          <div className="hero-copy landing-hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              AI operating system for home and local service businesses
            </div>
            <h1>Matchit helps service businesses</h1>
            <div className="hero-sequence" aria-label="Capture, quote, book, dispatch, get paid">
              {HERO_SEQUENCE.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  className={`hero-sequence-step${index === HERO_SEQUENCE.length - 1 ? ' final' : ''}${activeStep === step ? ' active' : ''}`}
                  style={{ '--sequence-delay': `${index * 120}ms` }}
                  onClick={() => setActiveStep(step)}
                >
                  <span className="hero-sequence-index">0{index + 1}</span>
                  <span className="hero-sequence-label">{step}</span>
                </button>
              ))}
            </div>
            <p className="hero-sub">
              Not just a chatbot. Matchit is your AI sales and operations layer — leads, conversations, estimates, jobs, field workflow, invoicing, and customer demand from Matchit Find.
            </p>
            <div className="hero-ctas">
              <Button size="lg" onClick={() => navigate('/signup')}>Start free for 14 days</Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/find')}>Find a pro →</Button>
            </div>
            <p className="hero-note">No credit card required. Setup takes under 10 minutes.</p>
            <div className="hero-highlight-grid">
              <div className="hero-highlight-card">
                <div className="hero-highlight-value">Leads</div>
                <div className="hero-highlight-copy">Unified inbox, AI qualification, and follow-up so opportunities never go cold.</div>
              </div>
              <div className="hero-highlight-card">
                <div className="hero-highlight-value">Jobs</div>
                <div className="hero-highlight-copy">Estimates convert into jobs, jobs assign to team members, field work closes the loop.</div>
              </div>
              <div className="hero-highlight-card">
                <div className="hero-highlight-value">Revenue</div>
                <div className="hero-highlight-copy">Invoices, Stripe payment flow, and analytics built around what service businesses care about.</div>
              </div>
            </div>
          </div>

          <div className="hero-panel landing-hero-panel">
            <div className="hero-panel-top">
              <div>
                <div className="hero-panel-label">{activeDemo.panelLabel}</div>
                <div className="hero-panel-title">{activeDemo.panelTitle}</div>
              </div>
              <div className="hero-live-pill">
                <span className="hero-live-dot" />
                {activeStep} live
              </div>
            </div>
            <div className="hero-signal-grid">
              {activeDemo.signals.map((signal) => (
                <div key={signal.label} className="hero-signal-card">
                  <div className="hero-signal-value">{signal.value}</div>
                  <div className="hero-signal-label">{signal.label}</div>
                </div>
              ))}
            </div>
            <div className="hero-feed">
              {activeDemo.feed.map((item) => (
                <div key={item.title} className="hero-feed-item">
                  <span className={`hero-feed-dot ${item.tone}`} />
                  <div>
                    <div className="hero-feed-title">{item.title}</div>
                    <div className="hero-feed-sub">{item.copy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="lsection" style={{ paddingTop: 0, paddingBottom: '12px' }}>
        <div className="trust-strip">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="trust-stat">
              <span className="trust-stat-icon">{stat.icon}</span>
              <strong className="trust-stat-value">{stat.value}</strong>
              <span className="trust-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PROOF BAND */}
      <section className="proof-band">
        <div className="proof-item">
          <span className="proof-kicker">What Matchit replaces</span>
          <strong>Leads in one tool, quotes in another, scheduling via text, payments scattered elsewhere</strong>
        </div>
        <div className="proof-item">
          <span className="proof-kicker">What Matchit becomes</span>
          <strong>One branded AI workflow for providers and one clean journey for customers</strong>
        </div>
        <div className="proof-item">
          <span className="proof-kicker">What makes it different</span>
          <strong>AI-native operations plus the Matchit Find demand layer — not just back-office software</strong>
        </div>
      </section>

      {/* PLATFORM */}
      <div className="lsection section-shell" id="platform">
        <div className="badge">Platform</div>
        <h2>Built around the actual service-business workflow.</h2>
        <div className="platform-grid">
          {PLATFORM_CARDS.map((card) => (
            <div key={card.title} className={`platform-card ${card.tone}`}>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{card.icon}</div>
              <div className="platform-card-kicker">{card.title}</div>
              <div className="platform-card-copy">{card.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WORKFLOW */}
      <div className="lsection section-shell" id="workflow">
        <div className="badge">Workflow</div>
        <h2>From first contact to finished work, Matchit keeps the journey moving.</h2>
        <div className="story-grid">
          {OPERATING_PANELS.map((panel) => (
            <div key={panel.title} className="story-card">
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{panel.icon}</div>
              <div className="story-eyebrow">{panel.eyebrow}</div>
              <div className="story-title">{panel.title}</div>
              <div className="story-copy">{panel.copy}</div>
            </div>
          ))}
        </div>

        <div className="demo-card landing-demo-card">
          <div className="demo-head">
            <div className="demo-av">M</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Matchit orchestration layer</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Lead in → estimate out → job booked → invoice sent</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className="tag tag-green" style={{ fontSize: '11px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                Live
              </span>
            </div>
          </div>
          <div className="demo-msgs">
            <div className="dmsg dm-lead" style={{ alignSelf: 'flex-end' }}>Our furnace stopped working. We need help today.</div>
            <div className="dmsg dm-agent">Matchit responds instantly, qualifies urgency, and collects what the team needs before anyone opens a laptop.</div>
            <div className="dmsg dm-agent">Estimate drafted from price book, sent through the customer portal, approved with a deposit path.</div>
            <div className="dmsg dm-agent">Approved estimate converts to a job, assigned to a technician, completion flows directly into invoicing.</div>
          </div>
        </div>
      </div>

      {/* INDUSTRIES */}
      <div className="lsection section-shell" id="industries">
        <div className="badge">Industries</div>
        <h2>Built for fast-moving local teams in the GTA and beyond.</h2>
        <div className="audience-grid">
          {INDUSTRIES.map((industry) => (
            <div key={industry} className="audience-pill">{industry}</div>
          ))}
        </div>
        <p className="industry-note">
          Matchit is strongest where speed, quoting, dispatch, and customer communication directly affect booked revenue.
        </p>
      </div>

      {/* PRICING */}
      <div className="lsection section-shell" id="pricing">
        <div className="badge">Pricing</div>
        <h2>Simple plans. Clear path from lead response to revenue ops.</h2>
        <div className="pricing-grid">
          <div className="plan">
            <div className="plan-name">Starter</div>
            <div className="plan-sub">For solo operators getting organized</div>
            <div className="plan-price"><sup>$</sup>49</div>
            <div className="plan-period">per month · billed monthly</div>
            <ul className="plan-features">
              <li>AI lead inbox and response basics</li>
              <li>Website lead capture</li>
              <li>Core dashboard and conversations</li>
              <li>Matchit Find visibility</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/signup')}>Start free trial</Button>
          </div>
          <div className="plan featured">
            <div className="plan-pop">Most popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-sub">For teams running quotes, jobs, and follow-up</div>
            <div className="plan-price"><sup>$</sup>99</div>
            <div className="plan-period">per month · billed monthly</div>
            <ul className="plan-features">
              <li>Estimates, jobs, team, and field workflow</li>
              <li>Campaigns and deeper analytics</li>
              <li>Price book and invoicing workflow</li>
              <li>Multi-channel AI sales coordination</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/signup')}>Start free trial</Button>
          </div>
          <div className="plan">
            <div className="plan-name">Business</div>
            <div className="plan-sub">For businesses building an AI-native ops stack</div>
            <div className="plan-price"><sup>$</sup>199</div>
            <div className="plan-period">per month · billed monthly</div>
            <ul className="plan-features">
              <li>Priority rollout and advanced automations</li>
              <li>Deeper demand, workflow, and integration support</li>
              <li>Future-ready for richer team and ops features</li>
              <li>Best fit for scaling service businesses</li>
            </ul>
            <Button variant="ghost" fullWidth onClick={() => navigate('/signup')}>Talk to sales</Button>
          </div>
        </div>
      </div>

      {/* WHY NOW */}
      <div className="lsection section-shell">
        <div className="badge">Why now</div>
        <h2>The old service-business stack was built for admin. Matchit is built for speed.</h2>
        <div className="story-grid compact">
          <div className="story-card">
            <div className="story-title">AI-native from the start</div>
            <div className="story-copy">Lead qualification, estimate sharing, field completion, invoicing, and future automations all live inside one product direction.</div>
          </div>
          <div className="story-card">
            <div className="story-title">Customer-side experience included</div>
            <div className="story-copy">Customers are not forced into a messy handoff. Public estimate flows and Matchit Find make the brand feel modern on both sides.</div>
          </div>
          <div className="story-card">
            <div className="story-title">Made for service businesses</div>
            <div className="story-copy">Everything maps to what matters: response time, quote speed, booked jobs, completed work, and collected revenue.</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="lsection section-shell">
        <div className="cta-block">
          <div>
            <div className="badge">Get started</div>
            <h2 style={{ marginBottom: '10px' }}>Bring your service business into one AI-powered workflow.</h2>
            <p className="cta-copy">
              Start with the free trial, onboard your business in 10 minutes, configure your AI agent, and turn Matchit into the operating system behind your lead-to-payment journey.
            </p>
          </div>
          <div className="cta-actions">
            <Button size="lg" onClick={() => navigate('/signup')}>Start free trial</Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/find')}>See customer side</Button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="logo-dot" />
          Matchit
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text3)' }}>© 2026 Matchit · matchit.ai</div>
        <div style={{ display: 'flex', gap: '14px' }}>
          <a href="#" style={{ fontSize: '13px', color: 'var(--text3)', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ fontSize: '13px', color: 'var(--text3)', textDecoration: 'none' }}>Terms</a>
        </div>
      </footer>
    </div>
  );
}
