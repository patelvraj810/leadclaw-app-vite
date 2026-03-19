import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Conversations } from './pages/Conversations';
import { Analytics } from './pages/Analytics';
import { AgentSetup } from './pages/AgentSetup';
import { Integrations } from './pages/Integrations';
import { Sources } from './pages/Sources';
import { Campaigns } from './pages/Campaigns';

// Layout
import { Layout } from './components/Layout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="sources" element={<Sources />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="agent" element={<AgentSetup />} />
          <Route path="integrations" element={<Integrations />} />
        </Route>
      </Routes>
    </Router>
  );
}
