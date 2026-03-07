import { useState } from 'react';

export default function ChatScreen({ conversation, onBack }) {
  const [msgs, setMsgs] = useState(conversation.chat);
  const [input, setInput] = useState('');

  function send() {
    const text = input.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMsgs(m => [...m, { from: 'me', text, time: now }]);
    setInput('');
  }

  return (
    <div className="chat-screen">
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>‹</button>
        <h1>{conversation.name}</h1>
      </div>
      <div className="chat-messages">
        {msgs.map((m, i) => (
          <div key={i}>
            {(i === 0 || msgs[i - 1].time !== m.time) && (
              <div className="chat-time">{m.time}</div>
            )}
            <div className={m.from === 'me' ? 'bubble-row-me' : 'bubble-row-them'}>
              <div className={`chat-bubble ${m.from === 'me' ? 'me' : 'them'}`}>{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="chat-send-btn" onClick={send}>&#10148;</button>
      </div>
    </div>
  );
}
