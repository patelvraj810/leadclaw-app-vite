import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, MessageSquare, LineChart,
  Cpu, Plug, Globe, Send, Calendar, Settings,
  DollarSign, FileText, UserCheck, Briefcase, Receipt, X,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { to: '/app/dashboard',     icon: LayoutDashboard, label: 'Dashboard',     statsKey: null },
      { to: '/app/leads',         icon: Users,           label: 'Leads',         statsKey: 'totalLeads' },
      { to: '/app/conversations', icon: MessageSquare,   label: 'Inbox',         statsKey: 'totalConversations' },
      { to: '/app/jobs',          icon: Calendar,        label: 'Jobs',          statsKey: null },
      { to: '/app/estimates',     icon: FileText,        label: 'Estimates',     statsKey: null },
      { to: '/app/invoices',      icon: Receipt,         label: 'Invoices',      statsKey: null },
      { to: '/app/field',         icon: Briefcase,       label: 'Field',         statsKey: null },
      { to: '/app/team',          icon: UserCheck,       label: 'Team',          statsKey: null },
      { to: '/app/analytics',     icon: LineChart,       label: 'Analytics',     statsKey: null },
    ],
  },
  {
    label: 'Growth',
    items: [
      { to: '/app/sources',   icon: Globe, label: 'Lead Sources', statsKey: null },
      { to: '/app/campaigns', icon: Send,  label: 'Campaigns',    statsKey: null },
    ],
  },
  {
    label: 'Config',
    items: [
      { to: '/app/agent',        icon: Cpu,        label: 'AI Agent',    statsKey: null },
      { to: '/app/pricebook',    icon: DollarSign, label: 'Price Book',  statsKey: null },
      { to: '/app/integrations', icon: Plug,       label: 'Integrations',statsKey: null },
      { to: '/app/settings',     icon: Settings,   label: 'Settings',    statsKey: null },
    ],
  },
];

export function Sidebar({ isOpen, onClose, stats }) {
  const { user } = useAuth();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userName    = user?.name || 'New User';
  const rawPlan     = user?.subscription_tier || user?.plan || 'starter';
  const userPlan    = rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1) + ' Plan';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand */}
      <div className="sb-logo">
        <div className="sb-logo-mark">
          <div className="logo-dot" />
        </div>
        <div className="sb-brand">
          <span className="sb-logo-text">Matchit</span>
          <span className="sb-logo-sub">Service OS</span>
        </div>
        <span className="sb-version">LIVE</span>
        <button className="menu-toggle" onClick={onClose} style={{ marginLeft: '4px' }}>
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="sb-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="sb-section">{group.label}</div>
            {group.items.map((item) => {
              const ItemIcon = item.icon;
              const count = item.statsKey && stats?.[item.statsKey];
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) => `nb${isActive ? ' active' : ''}`}
                >
                  <ItemIcon size={15} strokeWidth={1.6} />
                  {item.label}
                  {count ? <span className="nb-badge">{count}</span> : null}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sb-bottom">
        <NavLink to="/" onClick={onClose} className="nb nb-secondary mobile-only" style={{ marginBottom: '10px' }}>
          <Globe size={15} strokeWidth={1.5} />
          Back to site
        </NavLink>

        <div className="sb-metric">
          <div className="sb-metric-label">Pipeline this week</div>
          <div className="sb-metric-value">{stats?.totalLeads ?? 0}</div>
          <div className="sb-metric-sub">Active leads across all channels</div>
        </div>

        <div className="user-pill">
          <div className="u-av">{userInitial}</div>
          <div>
            <div className="u-name">{userName}</div>
            <div className="u-plan">{userPlan}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
