import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, MessageSquare, User, Search, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const passedConvId = location.state?.activeConversationId;

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data.conversations || []);

      if (res.data.conversations?.length > 0 && !activeConv) {
        if (passedConvId) {
          const matched = res.data.conversations.find((c) => c._id === passedConvId);
          setActiveConv(matched || res.data.conversations[0]);
        } else {
          setActiveConv(res.data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const res = await api.get(`/messages/conversation/${convId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [passedConvId]);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
      // Polling for updates every 4 seconds
      const timer = setInterval(() => {
        fetchMessages(activeConv._id);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const res = await api.post('/messages', {
        conversationId: activeConv._id,
        content,
      });
      setMessages((prev) => [...prev, res.data.message]);

      // update conversation snippet
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConv._id
            ? { ...c, lastMessage: content, lastMessageAt: new Date() }
            : c
        )
      );
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 0 60px' }}>
      <div className="container">
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--navy-900)' }}>Messages</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--navy-500)' }}>
            Real-time direct communication with clients and freelancers
          </p>
        </div>

        <div
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 340px) 1fr',
            height: '620px',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Left: Conversations List */}
          <div
            style={{
              borderRight: '1px solid var(--navy-200)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--navy-50)',
            }}
          >
            <div style={{ padding: '16px', borderBottom: '1px solid var(--navy-200)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-900)' }}>
                Conversations ({conversations.length})
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.length === 0 ? (
                <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--navy-500)', fontSize: '0.875rem' }}>
                  No active conversations yet. Reach out to a freelancer or client to start a chat!
                </div>
              ) : (
                conversations.map((conv) => {
                  const partner = conv.participants?.find((p) => p._id !== user?._id);
                  const isSelected = activeConv?._id === conv._id;

                  return (
                    <div
                      key={conv._id}
                      onClick={() => setActiveConv(conv)}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--navy-200)',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--white)' : 'transparent',
                        borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
                          {partner?.name?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {partner?.name || 'Project Partner'}
                          </div>
                          {conv.project && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {conv.project.title}
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--navy-600)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {conv.lastMessage || 'No messages yet'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Message Thread */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--white)' }}>
            {activeConv ? (
              <>
                {/* Thread Header */}
                <div
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--navy-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ width: 36, height: 36 }}>
                      {activeConv.participants?.find((p) => p._id !== user?._id)?.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy-900)' }}>
                        {activeConv.participants?.find((p) => p._id !== user?._id)?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--navy-500)' }}>
                        {activeConv.participants?.find((p) => p._id !== user?._id)?.title || 'Direct Conversation'}
                      </div>
                    </div>
                  </div>

                  {activeConv.project && (
                    <span className="badge badge-violet" style={{ fontSize: '0.75rem' }}>
                      {activeConv.project.title}
                    </span>
                  )}
                </div>

                {/* Messages Body */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--navy-400)', fontSize: '0.9rem' }}>
                      Start the conversation by sending a message below.
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender?._id === user?._id || m.sender === user?._id;

                      return (
                        <div
                          key={m._id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMe ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '70%',
                              padding: '10px 16px',
                              borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                              background: isMe ? 'var(--primary)' : 'var(--navy-100)',
                              color: isMe ? 'var(--white)' : 'var(--navy-900)',
                              fontSize: '0.925rem',
                              lineHeight: 1.5,
                              boxShadow: 'var(--shadow-sm)',
                            }}
                          >
                            {m.content}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--navy-400)', marginTop: 4, padding: '0 4px' }}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  style={{
                    padding: '14px 20px',
                    borderTop: '1px solid var(--navy-200)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                    <Send size={16} /> Send
                  </button>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--navy-400)' }}>
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
