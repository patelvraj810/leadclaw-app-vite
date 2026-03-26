import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { PublicEstimate } from './pages/PublicEstimate';
import { AcceptInvite } from './pages/AcceptInvite';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Conversations } from './pages/Conversations';
import { Analytics } from './pages/Analytics';
import { AgentSetup } from './pages/AgentSetup';
import { Integrations } from './pages/Integrations';
import { Sources } from './pages/Sources';
import { Campaigns } from './pages/Campaigns';
import { Find } from './pages/Find';
import { Jobs } from './pages/Jobs';
import { Settings } from './pages/Settings';
import { PriceBook } from './pages/PriceBook';
import { Estimates } from './pages/Estimates';
import { Team } from './pages/Team';
import { Field } from './pages/Field';
import { Invoices } from './pages/Invoices';

// Layout
import { Layout } from './components/Layout';

// Central route map for both public marketplace surfaces and the protected
// service-provider operating system.
function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/find" element={<Find />} />
      <Route path="/estimate/:token" element={<PublicEstimate />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />

      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="conversations" element={<Conversations />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="sources" element={<Sources />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="agent" element={<AgentSetup />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="pricebook" element={<PriceBook />} />
        <Route path="estimates" element={<Estimates />} />
        <Route path="team" element={<Team />} />
        <Route path="field" element={<Field />} />
        <Route path="invoices" element={<Invoices />} />
      </Route>

      {/* Onboarding — protected but outside main app layout */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/leads" element={<Navigate to="/app/leads" replace />} />
      <Route path="/conversations" element={<Navigate to="/app/conversations" replace />} />
      <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
      <Route path="/agent" element={<Navigate to="/app/agent" replace />} />
      <Route path="/integrations" element={<Navigate to="/app/integrations" replace />} />
      <Route path="/sources" element={<Navigate to="/app/sources" replace />} />
      <Route path="/campaigns" element={<Navigate to="/app/campaigns" replace />} />
      <Route path="/jobs" element={<Navigate to="/app/jobs" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      <Route path="/estimates" element={<Navigate to="/app/estimates" replace />} />
      <Route path="/team" element={<Navigate to="/app/team" replace />} />
      <Route path="/invoices" element={<Navigate to="/app/invoices" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
