import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Tag } from '../components/ui/Tag';
import { fetchConversations, fetchMessages } from '../lib/api';

function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function channelColor(channel) {
  const c = (channel || '').toLowerCase();
  if (c === 'whatsapp') return 'green';
  if (c === 'sms') return 'blue';
  if (c === 'email') return 'purple';
  if (c === 'webchat' || c === 'web') return 'amber';
  return 'gray';
}

export function Conversations() {
  const [activeId, setActiveId] = useState(null);
  const [showList, setShowList] = useState(true);
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const msgsEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    fetchConversations()
      .then(data => {
        if (Array.isArray(data)) {
          setConversations(data);
        } else if (data.conversations) {
          setConversations(data.conversations);
        } else {
          setConversations([]);
        }
      })
      .catch(err => {
        console.error('Failed to load conversations:', err);
        setConversations([]);
      })
      .finally(() => setLoading(false));

    // Check if opening specific conv from query param
    const searchParams = new URLSearchParams(location.search);
    const idParam = searchParams.get('id');
    if (idParam) {
      setActiveId(idParam);
      setShowList(false);
    }
  }, [location.search]);

  // Set activeId to first conversation when conversations load
  useEffect(() => {
    if (conversations.length > 0 && !activeId) setActiveId(conversations[0].id);
  }, [conversations]);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, messages]);

  const openConversation = async (convId) => {
    if (!messages[convId] || messages[convId].length === 0) {
      try {
        const msgs = await fetchMessages(convId);
        setMessages(prev => ({
          ...prev,
          [convId]: Array.isArray(msgs) ? msgs : msgs.messages || []
        }));
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    }
    setActiveId(convId);
    setShowList(false);
  };

  const activeConv = conversations.find(c => c.id === activeId);
  const activeMsgs = messages[activeId] || [];
  const activeCount = conversations.filter(c => c.status === 'active').length;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        { direction: 'outbound', content: input.trim(), created_at: new Date().toISOString(), isManual: true }
      ]
    }));
    setInput('');
  };

  if (loading) return <div className="page active"><div className="loading">Loading...</div></div>;

  if (!activeConv && conversations.length === 0) {
    return (
      <div className="page active" id="p-conv">
        <div className="empty-state" style={{ padding: '60px 24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '340px', margin: '0 auto', lineHeight: 1.7 }}>
            No conversations yet. Leads will appear here once your AI agent starts responding.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active" id="p-conv" style={{ padding: 0 }}>
      <div className={`conv-layout ${!showList ? 'chat-open' : ''}`}>
        <div className="conv-list">
          <div className="cl-head">
            All conversations
            {activeCount > 0 && <Tag color="green">{activeCount} active</Tag>}
          </div>
          {conversations.map(c => {
            const timeAgo = c.lastMessage?.created_at ? formatTimeAgo(new Date(c.lastMessage.created_at)) : 'Just now';
            const preview = c.lastMessage?.content || 'No messages yet';
            const ch = (c.channel || 'web').toLowerCase();
            return (
              <div
                key={c.id}
                className={`cli ${activeId === c.id ? 'active' : ''}`}
                onClick={() => openConversation(c.id)}
              >
                <div className="cli-top">
                  <div className="cli-name" style={{ fontWeight: '500' }}>
                    {c.leads?.contact_name || 'Unknown Lead'}
                  </div>
                  <div className="cli-time">{timeAgo}</div>
                </div>
                <div className="cli-bot" style={{ justifyContent: 'flex-start', margin: '3px 0 4px' }}>
                  <Tag color={channelColor(ch)} style={{ fontSize: '10px' }}>{ch}</Tag>
                </div>
                <div className="cli-prev" style={{ fontWeight: 'normal', color: 'var(--text3)', whiteSpace: 'normal' }}>
                  {preview}
                </div>
                <div className="cli-bot" style={{ marginTop: '4px' }}>
                  <Tag color={c.status === 'active' ? 'green' : 'gray'} style={{ fontSize: '10px' }}>
                    {c.status || 'active'}
                  </Tag>
                </div>
              </div>
            );
          })}
        </div>

        <div className="conv-main">
          {!activeConv ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: '13px' }}>
              Select a conversation to view messages.
            </div>
          ) : (
            <>
              <div className="conv-top">
                <div className="conv-info">
                  <button
                    className="conv-back-btn mobile-only"
                    onClick={() => setShowList(true)}
                  >
                    ← Back
                  </button>
                  <div className="cav" style={{ background: 'var(--purple)' }}>
                    {activeConv.leads?.contact_name
                      ? activeConv.leads.contact_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : '??'}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {activeConv.leads?.contact_name || 'Unknown Lead'}
                      <Tag color={channelColor(activeConv.channel)} style={{ fontSize: '10px' }}>
                        {(activeConv.channel || 'web').toLowerCase()}
                      </Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{activeConv.leads?.contact_phone || ''}</div>
                  </div>
                </div>
                <span className={`tag ${activeConv.status === 'active' ? 'tag-green' : 'tag-gray'}`}>{activeConv.status || 'active'}</span>
              </div>

              <div className="msgs">
                {activeMsgs.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '12px', padding: '20px' }}>
                    No messages yet.
                  </div>
                )}
                {activeMsgs.map((m, i) => {
                  const isOutbound = m.direction === 'outbound';
                  const text = m.content || '';
                  const ts = m.created_at ? formatTimeAgo(new Date(m.created_at)) : '';
                  return (
                    <div key={i} className={`mrow ${isOutbound ? 'ai' : 'human'}`}>
                      {isOutbound ? (
                        <>
                          <div className="mav" style={m.isManual ? { background: 'var(--blue)' } : {}}>
                            {m.isManual ? 'You' : 'AI'}
                          </div>
                          <div>
                            <div className="mb">{text}</div>
                            <div className="mmeta">{ts}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="mb">{text}</div>
                            <div className="mmeta">{ts}</div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                <div ref={msgsEndRef} />
              </div>

              <div className="input-area">
                <div className="ibox">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Send a manual message or override AI..."
                    rows="1"
                  />
                  <button className="sbtn" onClick={handleSend}>→</button>
                </div>
                <div className="inote">
                  AI is handling this conversation · Manual messages override AI for this thread
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
