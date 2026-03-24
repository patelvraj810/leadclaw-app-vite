import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Menu, X } from 'lucide-react';

// Static AI Online indicator — would poll /api/health in a production implementation
const AiOnlineIndicator = () => (
  <div className="tag tag-green" style={{ fontSize: '12px', padding: '5px 12px' }}>
    <span className="src-dot" style={{ background: 'var(--green)' }}></span>
    {' '}AI Online
  </div>
);

export function Topbar({ toggleMenu, isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  let title = 'Dashboard';
  let sub = 'Good morning — your AI agent is active';
  let actions = null;

  if (location.pathname.includes('/app/leads')) {
    title = 'Leads';
    sub = 'All leads captured by your AI agent';
  } else if (location.pathname.includes('/app/conversations')) {
    title = 'Conversations';
    sub = 'Live AI agent conversations';
  } else if (location.pathname.includes('/app/analytics')) {
    title = 'Analytics';
    sub = 'Last 30 days performance';
  } else if (location.pathname.includes('/app/agent')) {
    title = 'AI Agent Setup';
    sub = 'Customise how your AI agent talks to leads';
  } else if (location.pathname.includes('/app/integrations')) {
    title = 'Integrations';
    sub = 'Connect your channels and tools';
  } else if (location.pathname.includes('/app/sources')) {
    title = 'Lead Sources';
    sub = 'Manage your capture channels';
  } else if (location.pathname.includes('/app/campaigns')) {
    title = 'Campaigns';
    sub = 'Active outreach campaigns';
  } else if (location.pathname.includes('/app/jobs')) {
    title = 'Jobs';
    sub = 'Manage your scheduled jobs';
  } else if (location.pathname.includes('/app/settings')) {
    title = 'Settings';
    sub = 'Manage your account and preferences';
  } else if (location.pathname.includes('/app/pricebook')) {
    title = 'Price Book';
    sub = 'Your services and pricing catalogue';
  } else if (location.pathname.includes('/app/dashboard')) {
    actions = (
      <div className="hidden-mobile" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <AiOnlineIndicator />
        <Button variant="ghost" style={{ fontSize: '13px' }} onClick={() => navigate('/')}>
          ← Site
        </Button>
      </div>
    );
  }

  return (
    <div className="topbar">
      <div className="topbar-main">
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div>
          <div className="tb-title">{title}</div>
          <div className="tb-sub">{sub}</div>
        </div>
      </div>
      <div className="topbar-actions">
        <div className="topbar-status hidden-mobile">
          <span className="topbar-status-dot"></span>
          AI orchestration live
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}
