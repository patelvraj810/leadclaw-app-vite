import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { convData } from '../data/conversations';
import { Tag } from '../components/ui/Tag';

export function Conversations() {
  const [activeId, setActiveId] = useState('sarah');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState({});
  const msgsEndRef = useRef(null);
  const location = useLocation();

  // Load initial msgs into state so we can mutate
  useEffect(() => {
    const initialMsgs = {};
    Object.keys(convData).forEach(k => {
      initialMsgs[k] = [...convData[k].msgs];
    });
    setMessages(initialMsgs);
    
    // Check if opening specific conv from query param
    const searchParams = new URLSearchParams(location.search);
    const idParam = searchParams.get('id');
    if (idParam && convData[idParam]) {
      setActiveId(idParam);
    }
  }, [location.search]);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, messages]);

  const activeConv = convData[activeId];
  const activeMsgs = messages[activeId] || [];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => ({
      ...prev,
      [activeId]: [
        ...prev[activeId],
        { f: 'agent', t: input.trim(), ts: 'Just now · Manual', isManual: true }
      ]
    }));
    setInput('');
  };

  if (!activeConv) return null;

  return (
    <div className="convo-layout">
      <div className="convo-list">
        <div className="cli-header">All conversations</div>
        {Object.values(convData).map(c => (
          <div 
            key={c.id}
            className={`cli-item ${activeId === c.id ? 'active' : ''}`}
            onClick={() => setActiveId(c.id)}
          >
            <div className="cli-top">
              <div className="cli-name" style={{ fontWeight: c.id === 'sarah' ? '600' : '500' }}>
                {c.name}
              </div>
              <div className="cli-time">{c.time.replace(' ago', '')}</div>
            </div>
            <div style={{ margin: '3px 0 6px' }}>
              <span className={`mode-pill mode-${c.mode.toLowerCase()}`}>{c.mode}</span>
            </div>
            <div 
              className="cli-preview" 
              style={{ fontWeight: c.id === 'sarah' ? '500' : 'normal', color: c.id === 'sarah' ? 'var(--text)' : 'var(--text3)' }}
            >
              {c.preview}
            </div>
            <div style={{ marginTop: '4px' }}>
              <Tag color={c.tagCls.replace('tag-', '')} style={{ fontSize: '10px' }}>
                {c.status}
              </Tag>
            </div>
          </div>
        ))}
      </div>
      
      <div className="convo-main">
        <div className="convo-topbar">
          <div className="convo-info">
            <div className="convo-av">{activeConv.av}</div>
            <div>
              <div className="convo-name-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {activeConv.name}
                <span className={`mode-pill mode-${activeConv.mode.toLowerCase()}`}>{activeConv.mode} mode</span>
              </div>
              <div className="convo-sub-text">{activeConv.sub}</div>
            </div>
          </div>
          <span className={`tag ${activeConv.tagCls}`}>{activeConv.tag}</span>
        </div>
        
        <div className="msgs-wrap">
          {activeMsgs.map((m, i) => (
            <div key={i} className={`msg-row ${m.f === 'agent' ? 'agent' : 'lead'}`}>
              {m.f === 'agent' ? (
                <>
                  <div className="msg-row-av" style={m.isManual ? { background: 'var(--blue)' } : {}}>
                    {m.isManual ? 'You' : 'AI'}
                  </div>
                  <div>
                    <div className="msg-bubble">{m.t}</div>
                    <div className="msg-meta">{m.ts}</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="msg-bubble">{m.t}</div>
                    <div className="msg-meta">{m.ts}</div>
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={msgsEndRef} />
        </div>
        
        <div className="input-area">
          <div className="input-box">
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Send a manual message or override AI..." 
              rows="1"
            />
            <button className="send-btn" onClick={handleSend}>→</button>
          </div>
          <div className="input-note">
            AI is handling this conversation · Manual messages override AI for this thread
          </div>
        </div>
      </div>
    </div>
  );
}
