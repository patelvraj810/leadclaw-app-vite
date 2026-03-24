import React, { useState, useEffect } from 'react';
import { fetchJobs, createJob, updateJob } from '../lib/api';
import { Tag } from '../components/ui/Tag';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';

const STATUS_CONFIG = {
  scheduled:   { color: 'gray',   label: 'Scheduled' },
  confirmed:   { color: 'blue',   label: 'Confirmed' },
  in_progress: { color: 'amber',  label: 'In Progress' },
  completed:   { color: 'green',  label: 'Completed' },
  cancelled:   { color: 'red',    label: 'Cancelled' },
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function weekEnd() {
  const d = new Date();
  d.setDate(d.getDate() + (6 - d.getDay()));
  return d.toISOString().slice(0, 10);
}

const EMPTY_FORM = {
  customer_name: '',
  customer_phone: '',
  job_description: '',
  service_type: '',
  address: '',
  scheduled_date: '',
  scheduled_time: '',
  duration_hours: '',
  price: '',
  notes: '',
};

export function Jobs() {
  const [tab, setTab] = useState('today');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchJobs()
      .then(data => {
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      })
      .catch(err => {
        console.error('Failed to load jobs:', err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const today = todayStr();
  const endOfWeek = weekEnd();

  const filtered = jobs.filter(j => {
    if (tab === 'today') return j.scheduled_date === today;
    if (tab === 'week') return j.scheduled_date >= today && j.scheduled_date <= endOfWeek;
    return true;
  });

  const handleMarkComplete = async (job) => {
    try {
      const updated = await updateJob(job.id, { status: 'completed' });
      setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'completed', ...updated } : j));
    } catch (err) {
      console.error('Failed to update job:', err);
    }
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.job_description.trim()) {
      setFormError('Customer name and job description are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const newJob = await createJob({
        ...form,
        price: form.price ? parseFloat(form.price) : undefined,
        duration_hours: form.duration_hours ? parseFloat(form.duration_hours) : undefined,
      });
      setJobs(prev => [newJob, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || 'Failed to create job.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusCfg = (status) => STATUS_CONFIG[status] || { color: 'gray', label: status || 'Unknown' };

  return (
    <div className="page active" id="p-jobs" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'today', label: 'Today' },
              { key: 'week',  label: 'This week' },
              { key: 'all',   label: 'All jobs' },
            ].map(t => (
              <button
                key={t.key}
                className={`fbtn${tab === t.key ? ' on' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button className="btn btn-dark btn-sm" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Cancel' : '+ New Job'}
          </button>
        </div>

        {/* New Job Form */}
        {showForm && (
          <Card style={{ marginBottom: '20px' }}>
            <CardHeader><CardTitle>New job</CardTitle></CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <div className="field-row">
                  <div className="field">
                    <label>Customer name <span style={{ color: 'var(--red)' }}>*</span></label>
                    <input type="text" value={form.customer_name} onChange={e => handleFormChange('customer_name', e.target.value)} placeholder="Jane Smith" />
                  </div>
                  <div className="field">
                    <label>Customer phone</label>
                    <input type="tel" value={form.customer_phone} onChange={e => handleFormChange('customer_phone', e.target.value)} placeholder="+1 416 555 0100" />
                  </div>
                </div>
                <div className="field">
                  <label>Job description <span style={{ color: 'var(--red)' }}>*</span></label>
                  <textarea value={form.job_description} onChange={e => handleFormChange('job_description', e.target.value)} placeholder="Describe the work to be done..." rows={2} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Service type</label>
                    <input type="text" value={form.service_type} onChange={e => handleFormChange('service_type', e.target.value)} placeholder="e.g. HVAC repair" />
                  </div>
                  <div className="field">
                    <label>Address</label>
                    <input type="text" value={form.address} onChange={e => handleFormChange('address', e.target.value)} placeholder="123 Main St, Toronto" />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Scheduled date</label>
                    <input type="date" value={form.scheduled_date} onChange={e => handleFormChange('scheduled_date', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Scheduled time</label>
                    <input type="time" value={form.scheduled_time} onChange={e => handleFormChange('scheduled_time', e.target.value)} />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Duration (hours)</label>
                    <input type="number" min="0" step="0.5" value={form.duration_hours} onChange={e => handleFormChange('duration_hours', e.target.value)} placeholder="2.5" />
                  </div>
                  <div className="field">
                    <label>Price ($)</label>
                    <input type="number" min="0" step="0.01" value={form.price} onChange={e => handleFormChange('price', e.target.value)} placeholder="250.00" />
                  </div>
                </div>
                <div className="field">
                  <label>Notes</label>
                  <textarea value={form.notes} onChange={e => handleFormChange('notes', e.target.value)} placeholder="Any additional notes..." rows={2} />
                </div>
                {formError && (
                  <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{formError}</div>
                )}
                <button type="submit" className="btn btn-dark" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create job'}
                </button>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Job list */}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '380px', margin: '0 auto', lineHeight: 1.7 }}>
              No jobs scheduled. Create your first job or let leads convert automatically.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(job => {
              const cfg = statusCfg(job.status);
              const canComplete = job.status === 'confirmed' || job.status === 'in_progress';
              return (
                <Card key={job.id}>
                  <CardBody>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{job.customer_name || 'Unknown customer'}</span>
                          <Tag color={cfg.color} style={{ fontSize: '10px' }}>{cfg.label}</Tag>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '4px' }}>{job.job_description || job.service_type || '—'}</div>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          {job.scheduled_date && (
                            <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
                              {job.scheduled_date}{job.scheduled_time ? ` at ${job.scheduled_time}` : ''}
                            </span>
                          )}
                          {job.address && (
                            <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{job.address}</span>
                          )}
                          {job.customer_phone && (
                            <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{job.customer_phone}</span>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                        {job.price != null && (
                          <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace" }}>
                            ${Number(job.price).toFixed(2)}
                          </span>
                        )}
                        {canComplete && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleMarkComplete(job)}
                          >
                            Mark complete
                          </button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
