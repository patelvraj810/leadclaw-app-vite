import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { convData } from '../data/conversations';
import { Tag } from '../components/ui/Tag';

export function Conversations() {
  const [activeId, setActiveId] = useState('sarah');
  const [showList, setShowList] = useState(true);
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
      setShowList(false);
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
    <div className="page active" id="p-conv" style={{ padding: 0 }}>
      <div className="conv-layout">
      <div className={`conv-list ${!showList ? 'hidden-mobile' : ''}`}>
        <div className="cl-head">
          All conversations
          <Tag color="green">2 active</Tag>
        </div>
        {Object.values(convData).map(c => (
          <div 
            key={c.id}
            className={`cli ${activeId === c.id ? 'active' : ''}`}
            onClick={() => {
              setActiveId(c.id);
              setShowList(false);
            }}
          >
            <div className="cli-top">
              <div className="cli-name" style={{ fontWeight: c.id === 'sarah' ? '600' : '500' }}>
                {c.name}
              </div>
              <div className="cli-time">{c.time.replace(' ago', '')}</div>
            </div>
            <div className="cli-bot" style={{ justifyContent: 'flex-start', margin: '3px 0 6px' }}>
              <span className={`mode-pill mode-${c.mode.toLowerCase()}`}>{c.mode}</span>
            </div>
            <div className="cli-prev" style={{ fontWeight: c.id === 'sarah' ? '500' : 'normal', color: c.id === 'sarah' ? 'var(--text)' : 'var(--text3)', whiteSpace: 'normal' }}>
              {c.preview}
            </div>
            <div className="cli-bot" style={{ marginTop: '4px' }}>
              <Tag color={c.tagCls.replace('tag-', '')} style={{ fontSize: '10px' }}>
                {c.status}
              </Tag>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`conv-main ${showList ? 'hidden-mobile' : ''}`}>
        <div className="conv-top">
          <div className="conv-info">
            <button 
              className="mobile-only" 
              onClick={() => setShowList(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', marginRight: '5px' }}
            >
              ←
            </button>
            <div className="cav" style={{ background: c => c.bgColor || 'var(--text)' }}>{activeConv.av}</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {activeConv.name}
                <span className={`mode-pill mode-${activeConv.mode.toLowerCase()}`}>{activeConv.mode} mode</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{activeConv.sub}</div>
            </div>
          </div>
          <span className={`tag ${activeConv.tagCls}`}>{activeConv.tag}</span>
        </div>
        
        <div className="msgs">
          {activeMsgs.map((m, i) => (
            <div key={i} className={`mrow ${m.f === 'agent' ? 'ai' : 'human'}`}>
              {m.f === 'agent' ? (
                <>
                  <div className="mav" style={m.isManual ? { background: 'var(--blue)' } : {}}>
                    {m.isManual ? 'You' : 'AI'}
                  </div>
                  <div>
                    <div className="mb">{m.t}</div>
                    <div className="mmeta">{m.ts}</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="mb">{m.t}</div>
                    <div className="mmeta">{m.ts}</div>
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={msgsEndRef} />
        </div>
        
        <div className="input-area">
          <div className="ibox">
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Send a manual message or override AI..." 
              rows="1"
            />
            <button className="sbtn" onClick={handleSend}>→</button>
          </div>
          <div className="inote">
            AI is handling this conversation · Manual messages override AI for this thread
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
