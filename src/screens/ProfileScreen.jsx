import { useState } from 'react';

export default function ProfileScreen() {
  const [name, setName] = useState('Aparna Sen');
  const [location, setLocation] = useState('Washington, DC');
  const [bio, setBio] = useState("Graduate student looking for a clean, chill roommate in NW DC. I'm an early bird, love cooking, and keep a tidy space.");
  const [budgetMin, setBudgetMin] = useState('800');
  const [budgetMax, setBudgetMax] = useState('1500');
  const [beds, setBeds] = useState('2');
  const hobbies = ['Cooking', 'Gaming', 'Coffee', 'Music'];

  return (
    <>
      <div className="top-bar">
        <h1>Profile &amp; Settings</h1>
      </div>
      <div className="profile-screen">
        <div className="profile-top-row">
          <div className="profile-fields-col">
            <div className="profile-field-group">
              <div className="field-label">Name</div>
              <input className="field-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="profile-field-group">
              <div className="field-label">Location</div>
              <input className="field-input" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>
          <div className="profile-photo-col">
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80"
              alt="profile"
            />
          </div>
        </div>

        <div className="profile-field-group" style={{ marginBottom: 14 }}>
          <div className="field-label">Bio</div>
          <textarea
            className="field-input field-textarea"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>

        <div className="profile-section">
          <div className="profile-section-head">
            <div className="profile-section-title">Roommate Preferences</div>
            <button className="profile-edit-btn">Edit</button>
          </div>
          <div className="profile-field-group">
            <div className="field-label">Budget Range ($/mo)</div>
            <div className="budget-range-row">
              <input
                className="field-input"
                placeholder="Min"
                value={budgetMin}
                onChange={e => setBudgetMin(e.target.value)}
              />
              <span className="budget-range-sep">–</span>
              <input
                className="field-input"
                placeholder="Max"
                value={budgetMax}
                onChange={e => setBudgetMax(e.target.value)}
              />
            </div>
          </div>
          <div className="profile-field-group">
            <div className="field-label">Desired Bedroom Count</div>
            <input
              className="field-input"
              value={beds}
              onChange={e => setBeds(e.target.value)}
              style={{ width: 80 }}
            />
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-head">
            <div className="profile-section-title">Personal Hobbies</div>
          </div>
          <div className="hobby-chips">
            {hobbies.map(h => <span key={h} className="hobby-chip">{h}</span>)}
          </div>
        </div>

        <div className="profile-section">
          <div className="profile-section-head">
            <div className="profile-section-title">Settings</div>
          </div>
          <div className="settings-row">
            <span className="settings-icon">⚙️</span>
            <span className="settings-label">Settings</span>
            <span className="settings-chevron">›</span>
          </div>
        </div>
      </div>
    </>
  );
}
