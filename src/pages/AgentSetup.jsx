import React, { useState, useEffect } from 'react';
import { fetchAgentSettings, saveAgentSettings } from '../lib/api';

export function AgentSetup() {
  const [name, setName] = useState('');
  const [biz, setBiz] = useState('');
  const [msg, setMsg] = useState('');
  const [tone, setTone] = useState('friendly');
  const [services, setServices] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const [saveError, setSaveError] = useState('');

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
        }
      })
      .catch(err => {
        // agent settings not yet configured — start with empty form
        console.info('Agent settings not loaded:', err.message);
      });
  }, []);

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
    <div className="page active" id="p-agent" style={{ padding: '0' }}>
      <div style={{ padding: '22px 24px' }}>
        <div className="agent-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>

            <div className="sp">
              <div className="sph">Identity</div>
              <div className="spb">
                <div className="field"><label>Agent name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex" /></div>
                <div className="field"><label>Business name</label><input type="text" value={biz} onChange={e => setBiz(e.target.value)} placeholder="e.g. Mike's HVAC" /></div>
                <div className="field"><label>Services <span style={{ fontWeight: 400, color: 'var(--text3)', fontSize: '11px' }}>(comma-separated)</span></label><input type="text" value={services} onChange={e => setServices(e.target.value)} placeholder="e.g. HVAC repair, furnace install, AC service" /></div>
                <div className="field"><label>Service area</label><input type="text" value={serviceArea} onChange={e => setServiceArea(e.target.value)} placeholder="e.g. Greater Toronto Area" /></div>
                <div className="field"><label>Opening message</label><textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Hi! I'm {name} from {biz}..." /></div>
              </div>
            </div>

            <div className="sp">
              <div className="sph">Sales tone</div>
              <div className="spb">
                <div className="tone-grid">
                  {[
                    { id: 'friendly', name: 'Friendly', desc: 'Warm, approachable' },
                    { id: 'professional', name: 'Professional', desc: 'Formal, confident' },
                    { id: 'energetic', name: 'Energetic', desc: 'Upbeat, closes fast' },
                    { id: 'concise', name: 'Concise', desc: 'Direct, no fluff' }
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

            <div className="sp">
              <div className="sph">Sales intelligence</div>
              <div className="spb">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Use SPIN selling to qualify leads</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Auto-switch mode (Hunter→Qualifier→Closer)</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Ask one question at a time</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Push for booking or deposit</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Auto nurture after 24h silence</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" style={{ width: 'auto', accentColor: 'var(--text)' }} />Attempt upsell when qualified</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" style={{ width: 'auto', accentColor: 'var(--text)' }} />Escalate to owner if lead is frustrated</label>
                </div>
              </div>
            </div>

            <div className="sp">
              <div className="sph">Objection handling</div>
              <div className="spb">
                <div style={{
                  padding: '20px',
                  background: 'var(--surface2)',
                  borderRadius: 'var(--r)',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'var(--text3)'
                }}>
                  Objection handlers will appear here once saved via the agent settings API.
                </div>
                <button className="btn btn-ghost btn-full" style={{ marginTop: '8px', fontSize: '12px' }}>+ Add objection handler</button>
              </div>
            </div>

            {/* Save button */}
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
                <span style={{ fontSize: '13px', color: 'var(--green)' }}>Settings saved successfully.</span>
              )}
            </div>

          </div>

          <div>
            <div className="prev-card">
              <div className="prev-head">
                <div className="prev-av">{(name || 'A').charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{previewName} — {biz || 'Business Name'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Live preview · Mode: Qualifier</div>
                </div>
                <div style={{ marginLeft: 'auto' }}><span className="mode-pill mode-qualifier">Qualifier</span></div>
              </div>
              <div className="prev-msgs">
                <div style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>Lead preview</div>
                <div className="dmsg" style={{ background: 'var(--surface2)', borderRadius: '3px 13px 13px 13px', maxWidth: '80%', fontSize: '13px' }}>
                  {previewText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
