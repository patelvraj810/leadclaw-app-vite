import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  LineChart,
  Cpu,
  Plug,
  Globe,
  Send,
  Calendar,
  Settings,
  DollarSign,
  X,
} from 'lucide-react';

export function Sidebar({ isOpen, onClose, stats }) {
  const { user } = useAuth();
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userName = user?.name || 'New User';
  const userPlan = user?.plan ? (user.plan.charAt(0).toUpperCase() + user.plan.slice(1) + ' Plan') : 'Starter Plan';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sb-logo">
        <div className="sb-logo-mark">
          <div className="logo-dot"></div>
        </div>
        <div className="sb-brand">
          <span className="sb-logo-text">Matchit</span>
          <span className="sb-logo-sub">AI sales command</span>
        </div>
        <span className="sb-version">LIVE</span>
        <button
          className="menu-toggle"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      <div className="sb-nav">
        <div className="sb-section">Overview</div>

        <NavLink
          to="/app/dashboard"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={15} strokeWidth={1.5} />
          Dashboard
        </NavLink>

        <NavLink
          to="/app/leads"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Users size={15} strokeWidth={1.5} />
          Leads {stats?.totalLeads ? <span className="nb-badge">{stats.totalLeads}</span> : null}
        </NavLink>

        <NavLink
          to="/app/conversations"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <MessageSquare size={15} strokeWidth={1.5} />
          Conversations {stats?.totalConversations ? <span className="nb-badge">{stats.totalConversations}</span> : null}
        </NavLink>

        <NavLink
          to="/app/analytics"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <LineChart size={15} strokeWidth={1.5} />
          Analytics
        </NavLink>

        <NavLink
          to="/app/jobs"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Calendar size={15} strokeWidth={1.5} />
          Jobs
        </NavLink>

        <div className="sb-section">Lead Generation</div>

        <NavLink
          to="/app/sources"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Globe size={15} strokeWidth={1.5} />
          Lead Sources
        </NavLink>

        <NavLink
          to="/app/campaigns"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Send size={15} strokeWidth={1.5} />
          Campaigns
        </NavLink>

        <div className="sb-section">Configuration</div>

        <NavLink
          to="/app/agent"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Cpu size={15} strokeWidth={1.5} />
          AI Agent
        </NavLink>

        <NavLink
          to="/app/integrations"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Plug size={15} strokeWidth={1.5} />
          Integrations
        </NavLink>

        <NavLink
          to="/app/pricebook"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <DollarSign size={15} strokeWidth={1.5} />
          Price Book
        </NavLink>

        <NavLink
          to="/app/settings"
          onClick={onClose}
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Settings size={15} strokeWidth={1.5} />
          Settings
        </NavLink>
      </div>

      <div className="sb-bottom">
        <NavLink
          to="/"
          onClick={onClose}
          className="nb mobile-only"
          style={{ marginBottom: '12px', border: '1px solid var(--border)', background: 'var(--surface2)' }}
        >
          <Globe size={15} strokeWidth={1.5} />
          Back to Website
        </NavLink>
        <div className="sb-metric">
          <div className="sb-metric-label">Pipeline this week</div>
          <div className="sb-metric-value">{stats?.totalLeads ?? 0}</div>
          <div className="sb-metric-sub">Live lead flow across all channels</div>
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
