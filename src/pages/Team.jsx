import { useState, useEffect } from 'react';
import {
  fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember, fetchJobs,
  fetchInvitations, createInvitation, resendInvitation, revokeInvitation,
} from '../lib/api';
import { Tag } from '../components/ui/Tag';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';
import { ModalShell } from '../components/ui/ModalShell';

const ROLES = [
  { key: 'technician', label: 'Technician', color: 'gray' },
  { key: 'dispatcher', label: 'Dispatcher', color: 'blue' },
  { key: 'admin',      label: 'Admin',       color: 'amber' },
  { key: 'owner',      label: 'Owner',       color: 'green' },
];

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'technician', title: '', notes: '' };

function roleConfig(role) {
  return ROLES.find(r => r.key === role) || { key: role, label: role, color: 'gray' };
}

function fmtExpiry(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Expires today';
  return `Expires in ${diff}d`;
}

// ─── Invite modal ──────────────────────────────────────────────────────────────
function InviteModal({ onCreated, onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole]   = useState('technician');
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [created, setCreated] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const result = await createInvitation({ email: email.trim(), role });
      setCreated(result);
      onCreated(result);
    } catch (err) {
      setError(err.message || 'Failed to send invite.');
    } finally {
      setSaving(false);
    }
  };

  if (created) {
    return (
      <ModalShell title="Invite sent" onClose={onClose} maxWidth={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>
            Invitation created for <strong>{created.email}</strong> ({created.role}).
            Share this link with them directly — email delivery is on the roadmap.
          </div>
          <div style={{
            background: 'var(--surface2)',
            border: '1px solid var(--surface3)',
            borderRadius: 'var(--r)',
            padding: '10px 12px',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--text2)',
            wordBreak: 'break-all',
          }}>
            {created.invite_url}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-dark btn-sm"
              onClick={() => { navigator.clipboard.writeText(created.invite_url); }}
            >
              Copy link
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Done</button>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.5 }}>
            This link expires in 7 days. The invitee will need a separate Matchit account registration flow — full acceptance login is on the roadmap.
          </div>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell title="Invite team member" subtitle="Send a role-based invite link to a new team member." onClose={onClose} maxWidth={480}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="field">
          <label>Email address <span style={{ color: 'var(--red)' }}>*</span></label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="jane@example.com"
            autoFocus
          />
        </div>
        <div className="field">
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            {ROLES.filter(r => r.key !== 'owner').map(r => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
        </div>
        {error && <div style={{ fontSize: '13px', color: 'var(--red)' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn btn-dark" disabled={saving}>
            {saving ? 'Creating…' : 'Create invite'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Invite row ────────────────────────────────────────────────────────────────
function InviteRow({ invite, onRevoke, onResend }) {
  const [actioning, setActioning] = useState(false);
  const rcfg = roleConfig(invite.role);
  const isExpired = invite.expires_at && new Date(invite.expires_at) < new Date();
  const statusColor = invite.status === 'accepted' ? 'green' : isExpired || invite.status === 'revoked' ? 'gray' : 'amber';
  const statusLabel = invite.status === 'accepted' ? 'Accepted' : invite.status === 'revoked' ? 'Revoked' : isExpired ? 'Expired' : 'Pending';

  const action = async (fn) => {
    setActioning(true);
    try { await fn(); } finally { setActioning(false); }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0',
      borderBottom: '1px solid var(--surface3)', flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>{invite.email}</span>
          <Tag color={rcfg.color} style={{ fontSize: '10px' }}>{rcfg.label}</Tag>
          <Tag color={statusColor} style={{ fontSize: '10px' }}>{statusLabel}</Tag>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: "'JetBrains Mono', monospace" }}>
          {fmtExpiry(invite.expires_at)}
        </div>
      </div>
      {invite.status === 'pending' && !isExpired && (
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => action(() => onResend(invite.id))}
            disabled={actioning}
            style={{ fontSize: '11px' }}
          >
            {actioning ? '…' : 'Resend'}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => action(() => onRevoke(invite.id))}
            disabled={actioning}
            style={{ fontSize: '11px', color: 'var(--red)' }}
          >
            Revoke
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Member form ───────────────────────────────────────────────────────────────
function MemberForm({ initial, onSave, onCancel }) {
  const [form, setForm]   = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const isEdit = !!initial?.id;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const result = isEdit
        ? await updateTeamMember(initial.id, form)
        : await createTeamMember(form);
      onSave(result, isEdit);
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label>Name <span style={{ color: 'var(--red)' }}>*</span></label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="field">
          <label>Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)}>
            {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label>Job title</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Lead HVAC Technician" />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Phone</label>
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 416 555 0100" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" />
        </div>
      </div>
      <div className="field">
        <label>Notes <span style={{ fontWeight: 400, color: 'var(--text3)' }}>(internal only)</span></label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes…" rows={2} />
      </div>
      {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit" className="btn btn-dark" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add member'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ─── Member card ───────────────────────────────────────────────────────────────
function MemberCard({ member, jobCount, onEdit, onToggleActive, onDelete }) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const rcfg    = roleConfig(member.role);
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleToggle = async () => {
    setToggling(true);
    try { await onToggleActive(member); } finally { setToggling(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Remove ${member.name} from your team? This cannot be undone.`)) return;
    setDeleting(true);
    try { await onDelete(member.id); } finally { setDeleting(false); }
  };

  return (
    <Card>
      <CardBody>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
            background: member.is_active ? 'var(--text)' : 'var(--surface3)',
            color: member.is_active ? '#fff' : 'var(--text3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace",
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: member.is_active ? 'var(--text)' : 'var(--text3)' }}>
                {member.name}
              </span>
              <Tag color={rcfg.color} style={{ fontSize: '10px' }}>{rcfg.label}</Tag>
              {!member.is_active && <Tag color="gray" style={{ fontSize: '10px' }}>Inactive</Tag>}
            </div>
            {member.title && <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>{member.title}</div>}
            {member.is_active && jobCount > 0 && (
              <div style={{ fontSize: '11px', color: 'var(--blue)', fontWeight: '600', fontFamily: "'JetBrains Mono', monospace", marginBottom: '4px' }}>
                {jobCount} active job{jobCount !== 1 ? 's' : ''}
              </div>
            )}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {member.phone && (
                <a href={`tel:${member.phone}`} style={{ fontSize: '12px', color: 'var(--text2)', textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace" }}>
                  {member.phone}
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} style={{ fontSize: '12px', color: 'var(--text2)', textDecoration: 'none' }}>
                  {member.email}
                </a>
              )}
            </div>
            {member.notes && <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px', fontStyle: 'italic' }}>{member.notes}</div>}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onEdit(member)}>Edit</button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleToggle}
              disabled={toggling}
              style={{ color: member.is_active ? 'var(--text2)' : 'var(--green)' }}
            >
              {toggling ? '…' : member.is_active ? 'Deactivate' : 'Reactivate'}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleDelete}
              disabled={deleting}
              style={{ color: 'var(--red)' }}
            >
              {deleting ? '…' : 'Remove'}
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Main Team page ────────────────────────────────────────────────────────────
export function Team() {
  const [members, setMembers]         = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [jobCounts, setJobCounts]     = useState({});
  const [loading, setLoading]         = useState(true);
  const [view, setView]               = useState('list');
  const [editing, setEditing]         = useState(null);
  const [showInactive, setShowInactive]   = useState(false);
  const [showInvites, setShowInvites]     = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchTeam(),
      fetchJobs({ status: 'scheduled' }),
      fetchInvitations().catch(() => []),
    ])
      .then(([teamData, jobsData, inviteData]) => {
        setMembers(Array.isArray(teamData) ? teamData : []);
        setInvitations(Array.isArray(inviteData) ? inviteData : []);
        const counts = {};
        (Array.isArray(jobsData) ? jobsData : []).forEach(j => {
          if (j.technician_id) counts[j.technician_id] = (counts[j.technician_id] || 0) + 1;
        });
        setJobCounts(counts);
      })
      .catch(err => console.error('Failed to load team:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (member, isEdit) => {
    setMembers(prev => isEdit ? prev.map(m => m.id === member.id ? member : m) : [...prev, member]);
    setEditing(null);
    setView('list');
  };

  const handleToggleActive = async (member) => {
    const updated = await updateTeamMember(member.id, { is_active: !member.is_active });
    setMembers(prev => prev.map(m => m.id === member.id ? updated : m));
  };

  const handleDelete = async (id) => {
    await deleteTeamMember(id);
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleInviteCreated = (invite) => {
    setInvitations(prev => [invite, ...prev]);
  };

  const handleRevoke = async (id) => {
    await revokeInvitation(id);
    setInvitations(prev => prev.map(i => i.id === id ? { ...i, status: 'revoked' } : i));
  };

  const handleResend = async (id) => {
    const updated = await resendInvitation(id);
    setInvitations(prev => prev.map(i => i.id === id ? updated : i));
  };

  const active   = members.filter(m => m.is_active);
  const inactive = members.filter(m => !m.is_active);
  const techs    = active.filter(m => m.role === 'technician' || m.role === 'dispatcher');
  const pendingInvites = invitations.filter(i => i.status === 'pending');

  return (
    <div className="page active" id="p-team">
      <PageHero eyebrow="Operations" title="Team" subtitle="Manage your technicians, staff, and pending invitations." />
      <div>

        {view === 'list' && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                {members.length > 0 && (
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Total', value: members.length },
                      { label: 'Active', value: active.length, color: 'var(--green)' },
                      { label: 'Field team', value: techs.length, color: 'var(--blue)' },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif", color: s.color || 'var(--text)' }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{s.label}</div>
                      </div>
                    ))}
                    {pendingInvites.length > 0 && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--amber)' }}>
                          {pendingInvites.length}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Pending invites</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowInviteModal(true)}>
                  Invite member
                </button>
                <button className="btn btn-dark btn-sm" onClick={() => { setEditing(null); setView('new'); }}>
                  + Add member
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading…</div>
            ) : members.length === 0 && invitations.length === 0 ? (
              <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>No team members yet</div>
                <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '340px', margin: '0 auto 20px', lineHeight: 1.7 }}>
                  Add your technicians and dispatchers to start assigning jobs, or invite them by email.
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost" onClick={() => setShowInviteModal(true)}>Invite by email</button>
                  <button className="btn btn-dark" onClick={() => { setEditing(null); setView('new'); }}>Add manually</button>
                </div>
              </div>
            ) : (
              <>
                {/* Active members */}
                {active.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {active.map(m => (
                      <MemberCard
                        key={m.id}
                        member={m}
                        jobCount={jobCounts[m.id] || 0}
                        onEdit={(member) => { setEditing(member); setView('edit'); }}
                        onToggleActive={handleToggleActive}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}

                {/* Inactive members */}
                {inactive.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowInactive(v => !v)}
                      style={{ marginBottom: '10px', fontSize: '12px', color: 'var(--text3)' }}
                    >
                      {showInactive ? '▾' : '▸'} {inactive.length} inactive member{inactive.length !== 1 ? 's' : ''}
                    </button>
                    {showInactive && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {inactive.map(m => (
                          <MemberCard
                            key={m.id}
                            member={m}
                            jobCount={0}
                            onEdit={(member) => { setEditing(member); setView('edit'); }}
                            onToggleActive={handleToggleActive}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Invitations */}
                {invitations.length > 0 && (
                  <div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowInvites(v => !v)}
                      style={{ marginBottom: '10px', fontSize: '12px', color: 'var(--text3)' }}
                    >
                      {showInvites ? '▾' : '▸'} {invitations.length} invitation{invitations.length !== 1 ? 's' : ''}
                      {pendingInvites.length > 0 && (
                        <span style={{ marginLeft: '6px', background: 'var(--amber)', color: '#fff', borderRadius: '20px', padding: '1px 7px', fontSize: '10px', fontWeight: '700' }}>
                          {pendingInvites.length} pending
                        </span>
                      )}
                    </button>
                    {showInvites && (
                      <Card>
                        <CardHeader><CardTitle>Invitations</CardTitle></CardHeader>
                        <CardBody>
                          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '12px', lineHeight: 1.6 }}>
                            Invites generate a shareable link valid for 7 days. Full email delivery and acceptance login are on the roadmap.
                          </div>
                          {invitations.map(inv => (
                            <InviteRow
                              key={inv.id}
                              invite={inv}
                              onRevoke={handleRevoke}
                              onResend={handleResend}
                            />
                          ))}
                        </CardBody>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Add / Edit form */}
        {(view === 'new' || view === 'edit') && (
          <>
            <button
              onClick={() => { setView('list'); setEditing(null); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text3)', marginBottom: '16px', padding: 0 }}
            >
              ← Team
            </button>
            <Card>
              <CardHeader>
                <CardTitle>{view === 'edit' ? `Edit ${editing?.name}` : 'Add team member'}</CardTitle>
              </CardHeader>
              <CardBody>
                <MemberForm
                  initial={view === 'edit' ? editing : null}
                  onSave={handleSave}
                  onCancel={() => { setView('list'); setEditing(null); }}
                />
              </CardBody>
            </Card>
          </>
        )}

      </div>

      {/* Invite modal */}
      {showInviteModal && (
        <InviteModal
          onCreated={handleInviteCreated}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}
