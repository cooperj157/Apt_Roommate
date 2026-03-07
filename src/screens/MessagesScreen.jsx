import { useState } from 'react';
import { messages } from '../data/dummy';
import ChatScreen from './ChatScreen';

export default function MessagesScreen() {
  const [activeChat, setActiveChat] = useState(null);

  if (activeChat) {
    return <ChatScreen conversation={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <>
      <div className="top-bar">
        <h1>Messages</h1>
        <button className="top-action">&#9998;</button>
      </div>
      <div className="messages-screen">
        <div className="messages-section-label">Matches</div>
        {messages.map(msg => (
          <div key={msg.id} className="message-row" onClick={() => setActiveChat(msg)}>
            <div className="msg-avatar-wrap">
              <img className="msg-avatar" src={msg.photo} alt={msg.name} />
              {msg.online && <span className="online-dot" />}
            </div>
            <div className="msg-body">
              <div className="msg-name">{msg.name} - Matched!</div>
              <div className="msg-preview">{msg.preview}</div>
            </div>
            <div className="msg-right">
              <span className="msg-time">{msg.time}</span>
              {msg.unread > 0
                ? <span className="unread-badge">{msg.unread}</span>
                : <span className="read-icon">✓</span>
              }
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
