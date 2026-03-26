const API_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('matchit_token');
}

async function parseApiError(response) {
  const err = await response.json().catch(() => ({ error: response.statusText }));
  return Object.assign(new Error(err.error || 'Request failed'), {
    status: response.status,
    data: err,
  });
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

async function publicApiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    throw await parseApiError(res);
  }
  return res.json();
}

// Core CRM + dashboard
export const fetchLeads = () => apiFetch('/api/leads');
export const fetchConversations = () => apiFetch('/api/conversations');
export const fetchStats = () => apiFetch('/api/stats');
export const fetchMessages = (conversationId) => apiFetch(`/api/messages/${conversationId}`);
export const sendMessage = (conversationId, content) => apiFetch(`/api/messages/${conversationId}`, { method: 'POST', body: JSON.stringify({ content }) });
export const fetchAnalytics = () => apiFetch('/api/analytics');

// Jobs
export const fetchJobs = (params = {}) => apiFetch(`/api/jobs?${new URLSearchParams(params)}`);
export const fetchJob = (id) => apiFetch(`/api/jobs/${id}`);
export const createJob = (data) => apiFetch('/api/jobs', { method: 'POST', body: JSON.stringify(data) });
export const updateJob = (id, data) => apiFetch(`/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const completeJob = (id, data = {}) => apiFetch(`/api/jobs/${id}/complete`, { method: 'POST', body: JSON.stringify(data) });

// Agent, channels, and onboarding
export const fetchAgentSettings = () => apiFetch('/api/agent-settings');
export const saveAgentSettings = (data) => apiFetch('/api/agent-settings', { method: 'POST', body: JSON.stringify(data) });
export const fetchPricebook = () => apiFetch('/api/pricebook');
export const createPricebookItem = (data) => apiFetch('/api/pricebook', { method: 'POST', body: JSON.stringify(data) });
export const updatePricebookItem = (id, data) => apiFetch(`/api/pricebook/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deletePricebookItem = (id) => apiFetch(`/api/pricebook/${id}`, { method: 'DELETE' });
export const fetchChannels = () => apiFetch('/api/channels');
export const saveChannel = (data) => apiFetch('/api/channels', { method: 'POST', body: JSON.stringify(data) });
export const submitFindRequest = (data) => apiFetch('/api/find/request', { method: 'POST', body: JSON.stringify(data) });
export const fetchOnboardingStatus = () => apiFetch('/api/onboarding/status');
export const completeOnboarding = (data) => apiFetch('/api/onboarding/complete', { method: 'POST', body: JSON.stringify(data) });
export const fetchKnowledgeBase = () => apiFetch('/api/onboarding/knowledge');
export const saveKnowledgeDoc = (data) => apiFetch('/api/onboarding/knowledge', { method: 'POST', body: JSON.stringify(data) });

// Team members
export const fetchTeam = () => apiFetch('/api/team');
export const createTeamMember = (data) => apiFetch('/api/team', { method: 'POST', body: JSON.stringify(data) });
export const updateTeamMember = (id, data) => apiFetch(`/api/team/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteTeamMember = (id) => apiFetch(`/api/team/${id}`, { method: 'DELETE' });

// Team invitations
export const fetchInvitations = () => apiFetch('/api/team/invitations');
export const createInvitation = (data) => apiFetch('/api/team/invitations', { method: 'POST', body: JSON.stringify(data) });
export const resendInvitation = (id) => apiFetch(`/api/team/invitations/${id}/resend`, { method: 'POST' });
export const revokeInvitation = (id) => apiFetch(`/api/team/invitations/${id}`, { method: 'DELETE' });

// Invite acceptance (public — no auth token required)
export const getInvitePreview = (token) => publicApiFetch(`/api/team/invitations/accept?token=${encodeURIComponent(token)}`);
export const acceptInvite = (data) => publicApiFetch('/api/team/invitations/accept', { method: 'POST', body: JSON.stringify(data) });

// Integrations
export const fetchIntegrations = () => apiFetch('/api/integrations');
export const seedIntegrations = () => apiFetch('/api/integrations/seed', { method: 'POST' });
export const updateIntegration = (provider, data) => apiFetch(`/api/integrations/${provider}`, { method: 'PATCH', body: JSON.stringify(data) });
export const disconnectIntegration = (provider) => apiFetch(`/api/integrations/${provider}`, { method: 'DELETE' });

// Campaigns
export const fetchCampaigns = (params = {}) => apiFetch(`/api/campaigns?${new URLSearchParams(params)}`);
export const createCampaign = (data) => apiFetch('/api/campaigns', { method: 'POST', body: JSON.stringify(data) });
export const updateCampaign = (id, data) => apiFetch(`/api/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteCampaign = (id) => apiFetch(`/api/campaigns/${id}`, { method: 'DELETE' });
export const activateCampaign = (id) => apiFetch(`/api/campaigns/${id}/activate`, { method: 'POST' });
export const pauseCampaign = (id) => apiFetch(`/api/campaigns/${id}/pause`, { method: 'POST' });
export const fetchCampaignRuns = (id, params = {}) => apiFetch(`/api/campaigns/${id}/runs?${new URLSearchParams(params)}`);
export const triggerCampaign = (id, data = {}) => apiFetch(`/api/campaigns/${id}/trigger`, { method: 'POST', body: JSON.stringify(data) });

// Invoices
export const fetchInvoices = (params = {}) => apiFetch(`/api/invoices?${new URLSearchParams(params)}`);
export const createInvoice = (data) => apiFetch('/api/invoices', { method: 'POST', body: JSON.stringify(data) });
export const fetchInvoice = (id) => apiFetch(`/api/invoices/${id}`);
export const updateInvoice = (id, data) => apiFetch(`/api/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const markInvoicePaid = (id) => apiFetch(`/api/invoices/${id}/mark-paid`, { method: 'POST' });
export const sendInvoiceToCustomer = (id, data = {}) => apiFetch(`/api/invoices/${id}/send`, { method: 'POST', body: JSON.stringify(data) });

// Estimates
export const fetchEstimates = (params = {}) => apiFetch(`/api/estimates?${new URLSearchParams(params)}`);
export const createEstimate = (data) => apiFetch('/api/estimates', { method: 'POST', body: JSON.stringify(data) });
export const fetchEstimate = (id) => apiFetch(`/api/estimates/${id}`);
export const updateEstimate = (id, data) => apiFetch(`/api/estimates/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const sendEstimate = (id) => apiFetch(`/api/estimates/${id}/send`, { method: 'POST' });
export const approveEstimate = (id) => apiFetch(`/api/estimates/${id}/approve`, { method: 'POST' });
export const declineEstimate = (id) => apiFetch(`/api/estimates/${id}/decline`, { method: 'POST' });
export const markDepositPaid = (id) => apiFetch(`/api/estimates/${id}/deposit`, { method: 'POST' });
export const convertEstimateToJob = (id, data = {}) => apiFetch(`/api/estimates/${id}/convert`, { method: 'POST', body: JSON.stringify(data) });
export const fetchPublicEstimate = (token) => publicApiFetch(`/api/estimates/public/${token}`);
export const publicApproveEstimate = (token) => publicApiFetch(`/api/estimates/public/${token}/approve`, { method: 'POST' });
export const publicDeclineEstimate = (token) => publicApiFetch(`/api/estimates/public/${token}/decline`, { method: 'POST' });
export const createEstimateDepositCheckout = (token) => publicApiFetch(`/api/estimates/public/${token}/deposit-checkout`, { method: 'POST' });
