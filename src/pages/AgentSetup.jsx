import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card';

export function AgentSetup() {
  const [name, setName] = useState('Alex');
  const [biz, setBiz] = useState("Mike's HVAC");
  const [msg, setMsg] = useState("Hi! I'm {name} from {biz} 👋 Thanks for reaching out! How can I help you today?");
  const [tone, setTone] = useState('friendly');

  const previewText = msg.replace('{name}', name || 'Alex').replace('{biz}', biz || "Mike's HVAC");
  const previewName = `${name || 'Alex'} — ${biz || "Mike's HVAC"}`;

  return (
    <div className="page-content active">
      <div className="setup-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div className="setup-panel">
            <div className="setup-panel-head">Agent identity</div>
            <div className="setup-panel-body">
              <div className="field">
                <label>Agent name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="field">
                <label>Business name</label>
                <input type="text" value={biz} onChange={e => setBiz(e.target.value)} />
              </div>
              <div className="field">
                <label>Opening message</label>
                <textarea value={msg} onChange={e => setMsg(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="setup-panel">
            <div className="setup-panel-head">Tone</div>
            <div className="setup-panel-body">
              <div className="tone-grid">
                {[
                  { id: 'friendly', name: 'Friendly', desc: 'Warm, approachable' },
                  { id: 'professional', name: 'Professional', desc: 'Formal, confident' },
                  { id: 'energetic', name: 'Energetic', desc: 'Upbeat, enthusiastic' },
                  { id: 'concise', name: 'Concise', desc: 'Brief, direct' }
                ].map(t => (
                  <div 
                    key={t.id} 
                    className={`tone-btn ${tone === t.id ? 'active' : ''}`}
                    onClick={() => setTone(t.id)}
                  >
                    <span className="tone-name">{t.name}</span>
                    <span className="tone-desc">{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="setup-panel">
            <div className="setup-panel-head">Common Q&A</div>
            <div className="setup-panel-body">
              <div className="faq-item">
                <div>
                  <div className="faq-q">What are your prices?</div>
                  <div className="faq-a">Emergency visits from $89. Full quote on-site.</div>
                </div>
                <button className="icon-btn">✎</button>
              </div>
              <div className="faq-item">
                <div>
                  <div className="faq-q">How fast can you come?</div>
                  <div className="faq-a">Same-day for emergencies, 24–48h regular.</div>
                </div>
                <button className="icon-btn">✎</button>
              </div>
              <div className="faq-item">
                <div>
                  <div className="faq-q">What areas do you serve?</div>
                  <div className="faq-a">GTA — Brampton, Mississauga, Oakville.</div>
                </div>
                <button className="icon-btn">✎</button>
              </div>
              <button className="btn btn-ghost btn-full" style={{ marginTop: '8px' }}>+ Add Q&A</button>
            </div>
          </div>

        </div>

        <div>
          <div className="preview-card">
            <div className="preview-head">
              <div className="preview-av">{(name || 'A').charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{previewName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Live preview</div>
              </div>
            </div>
            <div className="preview-msgs">
              <div className="dmsg dmsg-agent" style={{ animation: 'none', opacity: 1, maxWidth: '80%', fontSize: '13px' }}>
                {previewText}
              </div>
              <div className="dmsg dmsg-lead" style={{ animation: 'none', opacity: 1, maxWidth: '80%', fontSize: '13px' }}>
                My AC is making a strange grinding noise.
              </div>
              <div className="dmsg dmsg-agent" style={{ animation: 'none', opacity: 1, maxWidth: '80%', fontSize: '13px' }}>
                That sounds like a bearing or belt issue — both are very fixable! How old is the unit and what brand is it?
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--green-bg)', borderRadius: 'var(--r)', border: '1px solid var(--green-b)', fontSize: '12px', color: 'var(--green)', fontWeight: '500' }}>
                Lead qualified after 3 messages ✓
              </div>
            </div>
          </div>

          <Card style={{ marginTop: '12px' }}>
            <CardHeader>
              <CardTitle>Behaviour settings</CardTitle>
            </CardHeader>
            <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} /> Ask one question at a time
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} /> Always push toward next step
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} /> Auto follow-up after 24h silence
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 'auto', accentColor: 'var(--text)' }} /> Escalate to owner if frustrated
              </label>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
