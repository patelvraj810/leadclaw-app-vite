import { useState, useEffect } from 'react';
import { fetchAgentSettings, saveAgentSettings } from '../lib/api';
import { PageHero } from '../components/ui/PageHero';

const DEFAULT_BEHAVIOR = {
  spin_selling:        true,
  auto_mode_switch:    true,
  one_question:        true,
  push_booking:        true,
  auto_nurture:        true,
  attempt_upsell:      false,
  escalate_frustrated: false,
  objections:          [],
};

const INTELLIGENCE_FLAGS = [
  { key: 'spin_selling',        label: 'Use SPIN selling to qualify leads' },
  { key: 'auto_mode_switch',    label: 'Auto-switch mode (Hunter → Qualifier → Closer)' },
  { key: 'one_question',        label: 'Ask one question at a time' },
  { key: 'push_booking',        label: 'Push for booking or deposit' },
  { key: 'auto_nurture',        label: 'Auto nurture after 24h silence' },
  { key: 'attempt_upsell',      label: 'Attempt upsell when qualified' },
  { key: 'escalate_frustrated', label: 'Escalate to owner if lead is frustrated' },
];

// ─── Objection Handler CRUD ───────────────────────────────────────────────────
function ObjectionList({ objections, onChange }) {
  const [adding, setAdding] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [newResponse, setNewResponse] = useState('');

  const handleAdd = () => {
    if (!newTrigger.trim() || !newResponse.trim()) return;
    onChange([...objections, { trigger: newTrigger.trim(), response: newResponse.trim() }]);
    setNewTrigger('');
    setNewResponse('');
    setAdding(false);
  };

  const handleRemove = (idx) => {
    onChange(objections.filter((_, i) => i !== idx));
  };

  const handleUpdate = (idx, field, val) => {
    onChange(objections.map((o, i) => i === idx ? { ...o, [field]: val } : o));
  };

  return (
    <div>
      {objections.length === 0 && !adding && (
        <div style={{
          padding: '16px', background: 'var(--surface2)', borderRadius: 'var(--r)',
          fontSize: '13px', color: 'var(--text3)', textAlign: 'center', marginBottom: '8px',
        }}>
          No objection handlers yet. Add one to help your AI respond to common pushbacks.
        </div>
      )}

      {objections.map((obj, idx) => (
        <div key={idx} style={{
          padding: '12px', background: 'var(--surface2)', borderRadius: 'var(--r)',
          marginBottom: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={obj.trigger}
              onChange={e => handleUpdate(idx, 'trigger', e.target.value)}
              placeholder='When lead says "too expensive"'
              style={{ marginBottom: '6px', fontSize: '12px', fontStyle: 'italic' }}
            />
            <textarea
              value={obj.response}
              onChange={e => handleUpdate(idx, 'response', e.target.value)}
              placeholder="AI responds with..."
              rows={2}
              style={{ fontSize: '12px', lineHeight: 1.5 }}
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text3)', fontSize: '16px', padding: '2px 6px', flexShrink: 0,
            }}
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}

      {adding ? (
        <div style={{ padding: '12px', background: 'var(--surface2)', borderRadius: 'var(--r)', marginBottom: '8px' }}>
          <div className="field">
            <label style={{ fontSize: '12px' }}>When the lead says…</label>
            <input
              value={newTrigger}
              onChange={e => setNewTrigger(e.target.value)}
              placeholder='e.g. "too expensive", "need to think about it", "I found someone cheaper"'
              autoFocus
            />
          </div>
          <div className="field">
            <label style={{ fontSize: '12px' }}>AI responds with…</label>
            <textarea
              value={newResponse}
              onChange={e => setNewResponse(e.target.value)}
              placeholder="I completely understand — let me explain what's included in our price…"
              rows={2}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-dark btn-sm"
              onClick={handleAdd}
              disabled={!newTrigger.trim() || !newResponse.trim()}
            >
              Add handler
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setAdding(false); setNewTrigger(''); setNewResponse(''); }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-ghost btn-full"
          style={{ fontSize: '12px', marginTop: '4px' }}
          onClick={() => setAdding(true)}
        >
          + Add objection handler
        </button>
      )}
    </div>
  );
}

// ─── Main AgentSetup page ─────────────────────────────────────────────────────
export function AgentSetup() {
  const [name, setName]               = useState('');
  const [biz, setBiz]                 = useState('');
  const [msg, setMsg]                 = useState('');
  const [tone, setTone]               = useState('friendly');
  const [services, setServices]       = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [behavior, setBehavior]       = useState(DEFAULT_BEHAVIOR);
  const [saveStatus, setSaveStatus]   = useState(null); // null | 'saving' | 'saved' | 'error'
  const [saveError, setSaveError]     = useState('');

  useEffect(() => {
    fetchAgentSettings()
      .then(data => {
        if (data) {
          setName(data.name || '');
          setBiz(data.business_name || '');
          setMsg(data.opening_message || '');
          setTone(data.tone || 'friendly');
          setServices(Array.isArray(data.services) ? data.services.join(', ') : (data.services || ''));
          setServiceArea(data.service_area || '');
          // Merge saved behavior over defaults so new flags have defaults
          if (data.behavior && typeof data.behavior === 'object') {
            setBehavior({ ...DEFAULT_BEHAVIOR, ...data.behavior });
          }
        }
      })
      .catch(err => console.info('Agent settings not loaded:', err.message));
  }, []);

  const setFlag = (key, val) => setBehavior(b => ({ ...b, [key]: val }));
  const setObjections = (list) => setBehavior(b => ({ ...b, objections: list }));

  const handleSave = async () => {
    setSaveStatus('saving');
    setSaveError('');
    try {
      const servicesArray = services.split(',').map(s => s.trim()).filter(Boolean);
      await saveAgentSettings({
        name,
        business_name: biz,
        services: servicesArray,
        service_area: serviceArea,
        tone,
        opening_message: msg,
        behavior,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (err) {
      setSaveStatus('error');
      setSaveError(err.message || 'Failed to save settings.');
    }
  };

  const previewText = msg || 'Your opening message will appear here...';
  const previewName = name || 'Agent Name';

  return (
    <div className="page active" id="p-agent">
      <PageHero
        eyebrow="Configuration"
        title="AI Agent"
        subtitle="Define your agent's identity, tone, and knowledge so it responds like a trusted member of your team."
      />
      <div className="agent-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>

            {/* Identity */}
            <div className="sp">
              <div className="sph">Identity</div>
              <div className="spb">
                <div className="field">
                  <label>Agent name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex" />
                </div>
                <div className="field">
                  <label>Business name</label>
                  <input value={biz} onChange={e => setBiz(e.target.value)} placeholder="e.g. Mike's HVAC" />
                </div>
                <div className="field">
                  <label>
                    Services{' '}
                    <span style={{ fontWeight: 400, color: 'var(--text3)', fontSize: '11px' }}>(comma-separated)</span>
                  </label>
                  <input
                    value={services}
                    onChange={e => setServices(e.target.value)}
                    placeholder="e.g. HVAC repair, furnace install, AC service"
                  />
                </div>
                <div className="field">
                  <label>Service area</label>
                  <input value={serviceArea} onChange={e => setServiceArea(e.target.value)} placeholder="e.g. Greater Toronto Area" />
                </div>
                <div className="field">
                  <label>Opening message</label>
                  <textarea
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder="Hi! I'm {name} from {biz}..."
                  />
                </div>
              </div>
            </div>

            {/* Sales tone */}
            <div className="sp">
              <div className="sph">Sales tone</div>
              <div className="spb">
                <div className="tone-grid">
                  {[
                    { id: 'friendly',     name: 'Friendly',     desc: 'Warm, approachable' },
                    { id: 'professional', name: 'Professional', desc: 'Formal, confident' },
                    { id: 'energetic',    name: 'Energetic',    desc: 'Upbeat, closes fast' },
                    { id: 'concise',      name: 'Concise',      desc: 'Direct, no fluff' },
                  ].map(t => (
                    <div
                      key={t.id}
                      className={`tone ${tone === t.id ? 'on' : ''}`}
                      onClick={() => setTone(t.id)}
                    >
                      <span className="tone-name">{t.name}</span>
                      <span className="tone-desc">{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales intelligence */}
            <div className="sp">
              <div className="sph">Sales intelligence</div>
              <div className="spb">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {INTELLIGENCE_FLAGS.map(flag => (
                    <label
                      key={flag.key}
                      style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={!!behavior[flag.key]}
                        onChange={e => setFlag(flag.key, e.target.checked)}
                        style={{ width: 'auto', accentColor: 'var(--text)' }}
                      />
                      {flag.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Objection handling */}
            <div className="sp">
              <div className="sph">Objection handling</div>
              <div className="spb">
                <ObjectionList
                  objections={behavior.objections || []}
                  onChange={setObjections}
                />
              </div>
            </div>

            {/* Save */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                className="btn btn-dark"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                style={{ minWidth: '120px' }}
              >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save changes'}
              </button>
              {saveStatus === 'error' && (
                <span style={{ fontSize: '13px', color: 'var(--red)' }}>{saveError}</span>
              )}
              {saveStatus === 'saved' && (
                <span style={{ fontSize: '13px', color: 'var(--green)' }}>Settings saved.</span>
              )}
            </div>

          </div>

          {/* Live preview */}
          <div>
            <div className="prev-card">
              <div className="prev-head">
                <div className="prev-av">{(name || 'A').charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{previewName} — {biz || 'Business Name'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Live preview · Mode: Qualifier</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span className="mode-pill mode-qualifier">Qualifier</span>
                </div>
              </div>
              <div className="prev-msgs">
                <div style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Lead preview
                </div>
                <div className="dmsg" style={{ background: 'var(--surface2)', borderRadius: '3px 13px 13px 13px', maxWidth: '80%', fontSize: '13px' }}>
                  {previewText}
                </div>
              </div>
              {/* Behavior summary */}
              <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text3)', lineHeight: 1.8 }}>
                {INTELLIGENCE_FLAGS.filter(f => behavior[f.key]).map(f => (
                  <div key={f.key} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--green)' }}>✓</span> {f.label}
                  </div>
                ))}
                {(behavior.objections || []).length > 0 && (
                  <div style={{ marginTop: '4px', color: 'var(--text2)' }}>
                    {behavior.objections.length} objection handler{behavior.objections.length !== 1 ? 's' : ''} active
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
