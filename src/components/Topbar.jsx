import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Menu, X } from 'lucide-react';

const ROUTE_META = {
  '/app/dashboard':     { title: 'Dashboard',     sub: 'Live AI revenue engine' },
  '/app/leads':         { title: 'Leads',          sub: 'All leads captured by your AI agent' },
  '/app/conversations': { title: 'Inbox',           sub: 'Live AI agent conversations' },
  '/app/analytics':     { title: 'Analytics',       sub: 'Last 30 days performance' },
  '/app/agent':         { title: 'AI Agent',         sub: 'Customise how your agent talks to leads' },
  '/app/integrations':  { title: 'Integrations',    sub: 'Connect your channels and tools' },
  '/app/sources':       { title: 'Lead Sources',    sub: 'Manage your capture channels' },
  '/app/campaigns':     { title: 'Campaigns',       sub: 'Active outreach campaigns' },
  '/app/jobs':          { title: 'Jobs',             sub: 'Manage your scheduled jobs' },
  '/app/settings':      { title: 'Settings',         sub: 'Account and preferences' },
  '/app/pricebook':     { title: 'Price Book',       sub: 'Your services and pricing catalogue' },
  '/app/estimates':     { title: 'Estimates',        sub: 'Pre-booking conversion pipeline' },
  '/app/team':          { title: 'Team',             sub: 'Manage your technicians and staff' },
  '/app/field':         { title: 'Field',            sub: 'Technician job workflow' },
  '/app/invoices':      { title: 'Invoices',         sub: 'Turn completed work into collected revenue' },
};

const AiStatus = () => (
  <div className="topbar-status">
    <span className="topbar-status-dot" />
    AI live
  </div>
);

export function Topbar({ toggleMenu, isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const match = Object.entries(ROUTE_META).find(([path]) => location.pathname.includes(path));
  const { title, sub } = match?.[1] ?? { title: 'Matchit', sub: 'AI-powered service operations' };

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
        <AiStatus />
        {location.pathname.includes('/app/dashboard') && (
          <Button variant="ghost" size="sm" className="hidden-mobile" onClick={() => navigate('/')}>
            ← Site
          </Button>
        )}
      </div>
    </div>
  );
}
