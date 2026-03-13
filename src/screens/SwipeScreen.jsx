import { useState, useRef } from 'react';
import { roommates } from '../data/dummy';
import ApartmentListings from './ApartmentListings';

export default function SwipeScreen({ navigate }) {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [showApts, setShowApts] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState(null);

  const dragStart = useRef(null);

  const current = roommates[index];
  const next1 = roommates[index + 1];
  const next2 = roommates[index + 2];

  function doPass() {
    if (exiting) return;
    setFlipped(false);
    setExiting('left');
    setTimeout(() => { setIndex(i => i + 1); setExiting(null); }, 340);
  }

  function doLike() {
    if (exiting) return;
    const person = current;
    setFlipped(false);
    setLiked(l => ({ ...l, [person.id]: true }));
    setExiting('right');
    setTimeout(() => {
      setIndex(i => i + 1);
      setExiting(null);
      setMatchedPerson(person);
      setShowMatch(true);
    }, 340);
  }

  function doSave(e) {
    e.stopPropagation();
    if (!current) return;
    setSaved(s => ({ ...s, [current.id]: !s[current.id] }));
  }

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp(e) {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    dragStart.current = null;

    // Swipe down: downward movement dominant and past threshold
    if (dy > 20 && dy > Math.abs(dx) * 0.5) {
      setShowApts(true);
      return;
    }

    // Tap: barely moved → flip
    if (dist < 10) {
      setFlipped(f => !f);
    }
  }

  if (showApts && current) {
    return <ApartmentListings person={current} onBack={() => setShowApts(false)} navigate={navigate} />;
  }

  if (!current) {
    return (
      <div className="swipe-screen" style={{ justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 48 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>You&apos;ve seen everyone!</div>
        <div style={{ fontSize: 14, color: 'var(--text-mid)' }}>Check your matches.</div>
      </div>
    );
  }

  return (
    <div className="swipe-screen">
      {showMatch && matchedPerson && (
        <div className="match-overlay">
          <div className="match-card">
            <h2>It&apos;s a Match!</h2>
            <p>You and {matchedPerson.name} both liked each other!</p>
            <div className="match-avatars">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80" alt="you" />
              <img src={matchedPerson.photo} alt={matchedPerson.name} />
            </div>
            <button className="match-msg-btn" onClick={() => { setShowMatch(false); navigate('messages'); }}>
              Send a Message
            </button>
            <button className="match-keep-btn" onClick={() => setShowMatch(false)}>
              Keep Swiping
            </button>
          </div>
        </div>
      )}

      <div className="card-stack">
        {next2 && <div className="swipe-card behind-2"><div style={{ height: 280, background: '#e8f0f1' }} /></div>}
        {next1 && (
          <div className="swipe-card behind-1">
            <img className="card-photo" src={next1.photo} alt={next1.name} />
          </div>
        )}

        <div
          className={`swipe-card front flip-card${flipped ? ' flipped' : ''}${exiting === 'left' ? ' card-exit-left' : exiting === 'right' ? ' card-exit-right' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <div className="flip-card-inner">

            {/* FRONT FACE */}
            <div className="flip-face flip-front">
              <div className="card-photo-wrap">
                <img className="card-photo" src={current.photo} alt={current.name} />
                <div className="swipe-down-hint">
                  Swipe Down<br />to view<br />apartments
                  <span className="hint-arrow">↓</span>
                </div>
                <div className="flip-hint">Tap to view profile</div>
              </div>
              <div className="card-info">
                <div className="card-name">{current.name}, {current.age}</div>
                <div className="card-meta">
                  <span className="card-meta-item">📍 {current.location}</span>
                  <span className="card-meta-item">🛏 {current.beds}</span>
                  <span className="card-meta-item">💰 {current.price}</span>
                </div>
                <div className="card-hobbies">
                  <strong>Hobbies:</strong> {current.hobbies.join(', ')}
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="flip-face flip-back">
              <div className="profile-back-header">
                <img className="profile-back-photo" src={current.photo} alt={current.name} />
                <div className="profile-back-name">{current.name}, {current.age}</div>
                <div className="profile-back-location">📍 {current.location}</div>
              </div>
              <div className="profile-back-body">
                <div className="profile-back-bio">{current.bio}</div>
                <div className="profile-back-section-title">Budget</div>
                <div className="profile-back-value">💰 {current.price}</div>
                <div className="profile-back-section-title">Looking For</div>
                <div className="profile-back-value">🛏 {current.beds}</div>
                <div className="profile-back-section-title">Hobbies</div>
                <div className="profile-back-chips">
                  {current.hobbies.map(h => (
                    <span key={h} className="profile-back-chip">{h}</span>
                  ))}
                </div>
                <button
                  className="view-apts-btn"
                  onPointerDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); setShowApts(true); }}
                >
                  View Apartments →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-pass" onClick={doPass}>✕</button>
        <button className={`btn-like${liked[current.id] ? ' active' : ''}`} onClick={doLike}>♡</button>
      </div>

      <div className="dot-indicators">
        {roommates.map((_, i) => (
          <div key={i} className={`dot${i === index ? ' active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
