import React, { useState } from 'react';

export function AgentSetup() {
  const [name, setName] = useState('Alex');
  const [biz, setBiz] = useState("Mike's HVAC");
  const [msg, setMsg] = useState("Hi! I'm {name} from {biz} 👋 I'd love to help — can I ask, is this an emergency or a scheduled service?");
  const [tone, setTone] = useState('friendly');

  const previewText = msg.replace('{name}', name || 'Alex').replace('{biz}', biz || "Mike's HVAC");
  const previewName = `${name || 'Alex'} — ${biz || "Mike's HVAC"}`;

  return (
    <div className="page active" id="p-agent">
      <div style={{ padding: '22px 24px' }}>
        <div className="agent-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>

            <div className="sp"><div className="sph">Identity</div><div className="spb">
              <div className="field"><label>Agent name</label><input type="text" value={name} onChange={e => setName(e.target.value)} /></div>
              <div className="field"><label>Business name</label><input type="text" value={biz} onChange={e => setBiz(e.target.value)} /></div>
              <div className="field"><label>Opening message</label><textarea value={msg} onChange={e => setMsg(e.target.value)} /></div>
            </div></div>

            <div className="sp"><div className="sph">Sales tone</div><div className="spb">
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
            </div></div>

            <div className="sp"><div className="sph">Sales intelligence</div><div className="spb">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Use SPIN selling to qualify leads</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Auto-switch mode (Hunter→Qualifier→Closer)</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Ask one question at a time</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Push for booking or deposit</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} />Auto nurture after 24h silence</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" style={{ width: 'auto', accentColor: 'var(--text)' }} />Attempt upsell when qualified</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}><input type="checkbox" style={{ width: 'auto', accentColor: 'var(--text)' }} />Escalate to owner if lead is frustrated</label>
              </div>
            </div></div>

            <div className="sp"><div className="sph">Objection handling</div><div className="spb">
              <div className="faq-row"><div><div className="fq">"Too expensive"</div><div className="fa">I get that — our $89 diagnostic gets applied to the repair cost, so if we fix it same visit, you're not paying twice. Would that work?</div></div><button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>✎</button></div>
              <div className="faq-row"><div><div className="fq">"I need to think about it"</div><div className="fa">Totally fair. Just so you know, we have 2 slots today and 1 tomorrow — if you want, I'll hold one for 30 mins while you decide?</div></div><button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>✎</button></div>
              <div className="faq-row"><div><div className="fq">"I'm getting other quotes"</div><div className="fa">Smart move. While you're comparing — can I ask what's most important to you? Speed, price, or guarantee? I want to make sure I'm comparing the right things for you.</div></div><button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>✎</button></div>
              <button className="btn btn-ghost btn-full" style={{ marginTop: '8px', fontSize: '12px' }}>+ Add objection handler</button>
            </div></div>

          </div>
          <div>
            <div className="prev-card">
              <div className="prev-head">
                <div className="prev-av">{(name || 'A').charAt(0).toUpperCase()}</div>
                <div><div style={{ fontSize: '13px', fontWeight: '600' }}>{previewName}</div><div style={{ fontSize: '11px', color: 'var(--text3)' }}>Live preview · Mode: Qualifier</div></div>
                <div style={{ marginLeft: 'auto' }}><span className="mode-pill mode-qualifier">🎯 Qualifier</span></div>
              </div>
              <div className="prev-msgs">
                <div style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', marginBottom: '4px', fontFamily: "'JetBrains Mono', monospace" }}>Lead from Facebook Group</div>
                <div className="dmsg" style={{ background: 'var(--surface2)', borderRadius: '3px 13px 13px 13px', maxWidth: '80%', fontSize: '13px' }}>
                  {previewText}
                </div>
                <div className="dmsg" style={{ background: 'var(--text)', color: '#fff', borderRadius: '13px 3px 13px 13px', maxWidth: '80%', alignSelf: 'flex-end', fontSize: '13px' }}>
                  My AC stopped blowing cold air.
                </div>
                <div className="dmsg" style={{ background: 'var(--surface2)', borderRadius: '3px 13px 13px 13px', maxWidth: '80%', fontSize: '13px' }}>
                  Sounds like a refrigerant or compressor issue — both fixable same-day. How old is the unit and is it a central AC or mini-split?
                </div>
                <div style={{ padding: '9px 12px', background: 'var(--green-bg)', borderRadius: 'var(--r)', border: '1px solid var(--green-b)', fontSize: '11px', color: 'var(--green)', fontWeight: '500' }}>
                  🎯 Qualifier → 💰 Closer (after next message)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
