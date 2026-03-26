import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tag } from '../components/ui/Tag';
import { fetchConversations, fetchMessages, sendMessage } from '../lib/api';

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
  const [selectedId, setSelectedId] = useState(null);
  const [showList, setShowList] = useState(true);
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const msgsEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active ID from URL param during render — no effect needed
  // URL ?id= may be a conversation ID or a lead ID (from Leads page click).
  // Resolve it: try conversation ID first, then fall back to matching lead_id.
  const urlParam = new URLSearchParams(location.search).get('id');
  const resolvedUrlId = urlParam
    ? (conversations.find(c => c.id === urlParam)?.id ?? conversations.find(c => c.lead_id === urlParam)?.id ?? null)
    : null;
  // Priority: resolved URL param > user selection > first conversation
  const activeId = resolvedUrlId || selectedId || (conversations.length > 0 ? conversations[0].id : null);

  // Load conversations once on mount
  useEffect(() => {
    fetchConversations()
      .then(data => {
        if (Array.isArray(data)) {
          setConversations(data);
        } else if (data && data.conversations) {
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
  }, []);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, messages]);

  // Clear send error when conversation changes
  useEffect(() => {
    setSendError(null);
  }, [activeId]);

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
    setSelectedId(convId);
    setShowList(false);
  };

  const activeConv = conversations.find(c => c.id === activeId);
  const activeMsgs = messages[activeId] || [];
  const activeCount = conversations.filter(c => c.status === 'active').length;

  const handleSend = async () => {
    const content = input.trim();
    if (!content || !activeId || sending) return;
    setInput('');
    setSendError(null);
    setSending(true);

    // Optimistic local insert
    const tempId = `tmp-${Date.now()}`;
    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), {
        id: tempId,
        direction: 'outbound',
        content,
        created_at: new Date().toISOString(),
        sender_type: 'owner',
      }],
    }));

    try {
      const saved = await sendMessage(activeId, content);
      // Replace temp message with persisted one
      setMessages(prev => ({
        ...prev,
        [activeId]: (prev[activeId] || []).map(m => m.id === tempId ? saved : m),
      }));
    } catch (err) {
      console.error('Failed to persist message:', err.message);
      setSendError('Message failed to send. It is shown locally but not delivered.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="page active"><div className="loading">Loading conversations…</div></div>;

  if (!activeConv && conversations.length === 0) {
    return (
      <div className="page active" id="p-conv">
        <div className="empty-state" style={{ padding: '60px 24px' }}>
          <div className="panel-empty-copy">
            No conversations yet. Leads will appear here once your AI agent starts responding.
          </div>
        </div>
      </div>
    );
  }

  const phone = activeConv?.leads?.contact_phone || '';
  const leadId = activeConv?.lead_id || '';

  return (
    <div className="page active conversation-page" id="p-conv" style={{ padding: 0 }}>
      <div className={`conv-layout ${!showList ? 'chat-open' : ''}`}>
        <div className="conv-list">
          <div className="cl-head">
            <span>All conversations</span>
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
                  <div className="cli-name">
                    {c.leads?.contact_name || 'Unknown Lead'}
                  </div>
                  <div className="cli-time">{timeAgo}</div>
                </div>
                <div className="cli-bot" style={{ justifyContent: 'flex-start', margin: '3px 0 4px' }}>
                  <Tag color={channelColor(ch)} style={{ fontSize: '10px' }}>{ch}</Tag>
                </div>
                <div className="cli-prev">
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

        <div className="conv-main conversation-shell">
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
                    <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{phone}</div>
                  </div>
                </div>
                <span className={`tag ${activeConv.status === 'active' ? 'tag-green' : 'tag-gray'}`}>{activeConv.status || 'active'}</span>
              </div>

              {/* Quick action bar */}
              <div className="conv-quick-bar">
                <button
                  className="conv-quick-btn"
                  onClick={() => navigate(`/app/estimates?leadId=${leadId}`)}
                  title="Create estimate for this lead"
                >
                  + Estimate
                </button>
                <button
                  className="conv-quick-btn"
                  onClick={() => navigate(`/app/jobs?leadId=${leadId}`)}
                  title="Create job for this lead"
                >
                  + Job
                </button>
                {phone && (
                  <a
                    className="conv-quick-btn"
                    href={`https://wa.me/${phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in WhatsApp"
                  >
                    WhatsApp ↗
                  </a>
                )}
                {phone && (
                  <a
                    className="conv-quick-btn"
                    href={`tel:${phone}`}
                    title="Call customer"
                  >
                    Call
                  </a>
                )}
                {leadId && (
                  <button
                    className="conv-quick-btn"
                    onClick={() => navigate(`/app/leads?id=${leadId}`)}
                    title="View lead profile"
                  >
                    View Lead
                  </button>
                )}
              </div>

              {sendError && (
                <div style={{ background: 'var(--red)', color: '#fff', fontSize: '12px', padding: '8px 16px' }}>
                  {sendError}
                </div>
              )}

              <div className="msgs">
                {activeMsgs.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '12px', padding: '20px' }}>
                    No messages yet.
                  </div>
                )}
                {activeMsgs.map((m, i) => {
                  const isOutbound = m.direction === 'outbound';
                  const isManual = m.sender_type === 'owner';
                  const text = m.content || '';
                  const ts = m.created_at ? formatTimeAgo(new Date(m.created_at)) : '';
                  const senderLabel = isOutbound ? (isManual ? 'You' : 'AI') : (activeConv.leads?.contact_name?.split(' ')[0] || 'Lead');
                  return (
                    <div key={i} className={`mrow ${isOutbound ? 'ai' : 'human'}`}>
                      {isOutbound ? (
                        <>
                          <div className={`mav ${isManual ? 'mav-owner' : ''}`}>
                            {isManual ? 'You' : 'AI'}
                          </div>
                          <div>
                            <div className="msender">{senderLabel}</div>
                            <div className="mb">{text}</div>
                            <div className="mmeta">{ts}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mav mav-lead">
                            {activeConv.leads?.contact_name
                              ? activeConv.leads.contact_name[0].toUpperCase()
                              : '?'}
                          </div>
                          <div>
                            <div className="msender">{senderLabel}</div>
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
                    placeholder="Send a manual message or override AI…"
                    rows="1"
                    disabled={sending}
                  />
                  <button className="sbtn" onClick={handleSend} disabled={sending}>
                    {sending ? '…' : '→'}
                  </button>
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
