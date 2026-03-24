const API_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('matchit_token');
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
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(err.error || 'Request failed'), { status: res.status, data: err });
  }
  return res.json();
}

export const fetchLeads = () => apiFetch('/api/leads');
export const fetchConversations = () => apiFetch('/api/conversations');
export const fetchStats = () => apiFetch('/api/stats');
export const fetchMessages = (conversationId) => apiFetch(`/api/messages/${conversationId}`);
export const fetchAnalytics = () => apiFetch('/api/analytics');
export const fetchJobs = (params = {}) => apiFetch(`/api/jobs?${new URLSearchParams(params)}`);
export const createJob = (data) => apiFetch('/api/jobs', { method: 'POST', body: JSON.stringify(data) });
export const updateJob = (id, data) => apiFetch(`/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const fetchAgentSettings = () => apiFetch('/api/agent-settings');
export const saveAgentSettings = (data) => apiFetch('/api/agent-settings', { method: 'POST', body: JSON.stringify(data) });
export const fetchPricebook = () => apiFetch('/api/pricebook');
export const createPricebookItem = (data) => apiFetch('/api/pricebook', { method: 'POST', body: JSON.stringify(data) });
export const updatePricebookItem = (id, data) => apiFetch(`/api/pricebook/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deletePricebookItem = (id) => apiFetch(`/api/pricebook/${id}`, { method: 'DELETE' });
export const fetchChannels = () => apiFetch('/api/channels');
export const saveChannel = (data) => apiFetch('/api/channels', { method: 'POST', body: JSON.stringify(data) });
export const submitFindRequest = (data) => apiFetch('/api/find/request', { method: 'POST', body: JSON.stringify(data) });
