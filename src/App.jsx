import { useState } from 'react';
import './index.css';
import SwipeScreen from './screens/SwipeScreen';
import MapScreen from './screens/MapScreen';
import MessagesScreen from './screens/MessagesScreen';
import ProfileScreen from './screens/ProfileScreen';

const NAV = [
  { id: 'home',     label: 'Home',     icon: '⌂' },
  { id: 'map',      label: 'Map',      icon: '🗺' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'profile',  label: 'Profile',  icon: '👤' },
];

export default function App() {
  const [tab, setTab] = useState('home');

  function renderScreen() {
    switch (tab) {
      case 'home':     return <SwipeScreen navigate={setTab} />;
      case 'map':      return <MapScreen />;
      case 'messages': return <MessagesScreen />;
      case 'profile':  return <ProfileScreen />;
      default:         return null;
    }
  }

  return (
    <div className="phone-frame">
      <div className="status-bar">
        <span className="notch" />
        <span className="time">9:41</span>
        <span className="icons">▲▲▌</span>
      </div>
      <div className="screen-wrapper">
        {renderScreen()}
      </div>
      <nav className="bottom-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={'nav-item' + (tab === item.id ? ' active' : '')}
            onClick={() => setTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {tab === item.id && <span className="nav-underline" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
