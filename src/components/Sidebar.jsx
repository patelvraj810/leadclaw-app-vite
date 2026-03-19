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
        <span className="sb-version" style={{ fontSize: '10px', color: 'var(--text3)', marginLeft: 'auto', fontFamily: '"JetBrains Mono", monospace' }}>v2.0</span>
      </div>
      
      <div className="sb-nav">
        <div className="sb-section">Main</div>
        
        <NavLink 
          to="/app/dashboard" 
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={15} strokeWidth={1.5} />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/app/leads" 
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <Users size={15} strokeWidth={1.5} />
          Leads <span className="nav-badge">4</span>
        </NavLink>
        
        <NavLink 
          to="/app/conversations" 
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <MessageSquare size={15} strokeWidth={1.5} />
          Conversations <span className="nav-badge">2</span>
        </NavLink>
        
        <NavLink 
          to="/app/analytics" 
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <LineChart size={15} strokeWidth={1.5} />
          Analytics
        </NavLink>

        <div className="sb-section" style={{ marginTop: '12px' }}>Lead Generation</div>
        
        <NavLink 
          to="/app/sources" 
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <Globe size={15} strokeWidth={1.5} />
          Lead Sources <span className="nav-badge" style={{ background: 'var(--amber)' }}>3</span>
        </NavLink>

        <NavLink 
          to="/app/campaigns" 
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <Send size={15} strokeWidth={1.5} />
          Campaigns
        </NavLink>

        <div className="sb-section" style={{ marginTop: '12px' }}>Configuration</div>
        
        <NavLink 
          to="/app/agent" 
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <Cpu size={15} strokeWidth={1.5} />
          AI Agent
        </NavLink>
        
        <NavLink 
          to="/app/integrations" 
          className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
        >
          <Plug size={15} strokeWidth={1.5} />
          Integrations
        </NavLink>
      </div>

      <div className="sb-bottom">
        <div className="user-pill">
          <div className="user-av">M</div>
          <div>
            <div className="user-name">Mike Johnson</div>
            <div className="user-plan">Pro · 14-day trial</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
