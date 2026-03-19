import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  LineChart, 
  Cpu, 
  Plug,
  Globe,
  Send
} from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="logo-dot"></div>
        <span className="sb-logo-text">LeadClaw</span>
        <span className="sb-version">v2.0</span>
      </div>
      
      <div className="sb-nav">
        <div className="sb-section">Overview</div>
        
        <NavLink 
          to="/app/dashboard" 
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={15} strokeWidth={1.5} />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/app/leads" 
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Users size={15} strokeWidth={1.5} />
          Leads <span className="nb-badge">4</span>
        </NavLink>
        
        <NavLink 
          to="/app/conversations" 
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <MessageSquare size={15} strokeWidth={1.5} />
          Conversations <span className="nb-badge">2</span>
        </NavLink>
        
        <NavLink 
          to="/app/analytics" 
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <LineChart size={15} strokeWidth={1.5} />
          Analytics
        </NavLink>

        <div className="sb-section">Lead Generation</div>
        
        <NavLink 
          to="/app/sources" 
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Globe size={15} strokeWidth={1.5} />
          Lead Sources <span className="nb-badge orange">3</span>
        </NavLink>

        <NavLink 
          to="/app/campaigns" 
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Send size={15} strokeWidth={1.5} />
          Campaigns
        </NavLink>

        <div className="sb-section">Configuration</div>
        
        <NavLink 
          to="/app/agent" 
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Cpu size={15} strokeWidth={1.5} />
          AI Agent
        </NavLink>
        
        <NavLink 
          to="/app/integrations" 
          className={({ isActive }) => `nb ${isActive ? 'active' : ''}`}
        >
          <Plug size={15} strokeWidth={1.5} />
          Integrations
        </NavLink>
      </div>

      <div className="sb-bottom">
        <div className="user-pill">
          <div className="u-av">M</div>
          <div>
            <div className="u-name">Mike Johnson</div>
            <div className="u-plan">Pro · 14-day trial</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
