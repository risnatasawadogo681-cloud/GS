import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Circle } from 'lucide-react';

export default function ChatSimulator({ 
  currentUserRole, 
  messages = [], 
  onSendMessage,
  activeContact = "Entreprise (TechCorp)" 
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeContact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    onSendMessage(inputText, activeContact);
    setInputText('');
  };

  // Filter messages for current active chat conversation
  const filteredMessages = messages.filter(msg => {
    const isRelatedToContact = msg.to === activeContact || msg.from === activeContact;
    const isRelatedToMe = msg.from === currentUserRole || msg.to === currentUserRole;
    return isRelatedToContact && isRelatedToMe;
  });

  const getRoleDisplayName = (role) => {
    if (role === 'student') return "Étudiant (Yanis)";
    if (role === 'enterprise') return "Entreprise (TechCorp)";
    if (role === 'supervisor') return "Encadreur (Dr. Martin)";
    if (role === 'admin') return "Administration";
    return role;
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid var(--border-color)', 
        background: 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple)'
          }}>
            <User size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeContact}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--status-success)' }}>
              <Circle size={6} fill="var(--status-success)" /> En ligne
            </div>
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div className="chat-messages">
        {filteredMessages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            textAlign: 'center',
            padding: '20px'
          }}>
            <p>Aucun message. Lancez la discussion !</p>
          </div>
        ) : (
          filteredMessages.map((msg, idx) => {
            const isMe = msg.from === currentUserRole;
            return (
              <div 
                key={idx} 
                className={`chat-bubble ${isMe ? 'sent' : 'received'}`}
              >
                <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '2px', fontWeight: 600 }}>
                  {isMe ? "Vous" : msg.fromName || getRoleDisplayName(msg.from)}
                </div>
                <div>{msg.text}</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.6, textAlign: 'right', marginTop: '4px' }}>
                  {msg.timestamp || "11:15"}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="chat-input-area">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Écrivez un message..."
          className="form-input"
          style={{ flex: 1, borderRadius: '8px', fontSize: '0.85rem' }}
        />
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ padding: '8px 12px', borderRadius: '8px', minWidth: '40px' }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
