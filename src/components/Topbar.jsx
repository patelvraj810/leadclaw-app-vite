import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

export function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine title and subtitle based on current route
  let title = 'Dashboard';
  let sub = 'Good morning — your AI agent is active';
  let actions = null;

  if (location.pathname.includes('/app/leads')) {
    title = 'Leads';
    sub = 'All leads captured by your AI agent';
    actions = <Button onClick={() => alert('Connect your lead form webhook to start capturing leads automatically.')}>+ Add lead</Button>;
  } else if (location.pathname.includes('/app/conversations')) {
    title = 'Conversations';
    sub = 'Live AI agent conversations';
  } else if (location.pathname.includes('/app/analytics')) {
    title = 'Analytics';
    sub = 'Last 30 days performance';
  } else if (location.pathname.includes('/app/agent')) {
    title = 'AI Agent Setup';
    sub = 'Customise how your AI agent talks to leads';
    actions = <Button onClick={() => alert('Settings saved!')}>Save changes</Button>;
  } else if (location.pathname.includes('/app/integrations')) {
    title = 'Integrations';
    sub = 'Connect your channels and tools';
  } else if (location.pathname.includes('/app/dashboard')) {
    actions = (
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div className="tag tag-green" style={{ fontSize: '12px', padding: '5px 12px' }}>
          <span style={{ width: '6px', height: '6px', background: 'var(--green)', borderRadius: '50%', display: 'inline-block' }}></span>
          {' '}AI Online
        </div>
        <Button variant="ghost" style={{ fontSize: '13px' }} onClick={() => navigate('/')}>
          ← Site
        </Button>
      </div>
    );
  }

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
