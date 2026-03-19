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
    <div className="page active" id="p-agent">
      <div className="setup">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div className="spnl">
            <div className="spnl-h">Agent identity</div>
            <div className="spnl-b">
              <div className="fld">
                <label>Agent name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="fld">
                <label>Business name</label>
                <input type="text" value={biz} onChange={e => setBiz(e.target.value)} />
              </div>
              <div className="fld">
                <label>Opening message</label>
                <textarea value={msg} onChange={e => setMsg(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="spnl">
            <div className="spnl-h">Tone</div>
            <div className="spnl-b">
              <div className="tg">
                {[
                  { id: 'friendly', name: 'Friendly', desc: 'Warm, approachable' },
                  { id: 'professional', name: 'Professional', desc: 'Formal, confident' },
                  { id: 'energetic', name: 'Energetic', desc: 'Upbeat, enthusiastic' },
                  { id: 'concise', name: 'Concise', desc: 'Brief, direct' }
                ].map(t => (
                  <div 
                    key={t.id} 
                    className={`tbtn ${tone === t.id ? 'active' : ''}`}
                    onClick={() => setTone(t.id)}
                  >
                    <span className="tn">{t.name}</span>
                    <span className="td">{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="spnl">
            <div className="spnl-h">Objection Handling</div>
            <div className="spnl-b">
              <div className="faq-item">
                <div>
                  <div className="faq-q">"Is $89 just for you to show up?"</div>
                  <div className="faq-a">"Yes, that covers the dispatch and diagnosis. If you proceed with the repair, we waive the $89."</div>
                </div>
                <button className="icon-btn">✎</button>
              </div>
              <div className="faq-item">
                <div>
                  <div className="faq-q">"I found someone cheaper"</div>
                  <div className="faq-a">"Totally understand. We're fully licensed, insured, and guarantee our work for 12 months. Do they offer that?"</div>
                </div>
                <button className="icon-btn">✎</button>
              </div>
              <div className="faq-item">
                <div>
                  <div className="faq-q">"Can you just give me a quote over text?"</div>
                  <div className="faq-a">"Every home is different! We need to see it to give you a fair, accurate price without surprise fees."</div>
                </div>
                <button className="icon-btn">✎</button>
              </div>
              <button className="btn btn-ghost btn-full" style={{ marginTop: '8px' }}>+ Add Objection</button>
            </div>
          </div>

        </div>

        <div>
          <div className="prev-c">
            <div className="prev-h">
              <div className="prev-av">{(name || 'A').charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{previewName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Live preview</div>
              </div>
            </div>
            <div className="prev-m">
              <div className="dmsg ai-msg">
                {previewText}
              </div>
              <div className="dmsg hm-msg">
                My AC is making a strange grinding noise.
              </div>
              <div className="dmsg ai-msg">
                That sounds like a bearing or belt issue — both are very fixable! How old is the unit and what brand is it?
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: 'var(--text3)' }}>
                <span className="mode-pill mode-qualifier">Condition gathered</span>
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--green-bg)', borderRadius: 'var(--r)', border: '1px solid var(--green-b)', fontSize: '12px', color: 'var(--green)', fontWeight: '500', marginTop: '10px' }}>
                Lead qualified after 3 messages ✓
              </div>
            </div>
          </div>

          <Card style={{ marginTop: '12px' }}>
            <CardHeader>
              <CardTitle>Sales intelligence</CardTitle>
            </CardHeader>
            <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} /> Detect intent (Price shopper vs Emergency)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} /> Auto-generate invoice link when booked
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 'auto', accentColor: 'var(--text)' }} /> Multi-touch follow up (Day 1, Day 3, Day 7)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '400', color: 'var(--text)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 'auto', accentColor: 'var(--text)' }} /> Use emojis in conversation
              </label>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
