import { useState } from 'react';
import { allApartments } from '../data/dummy';
import ApartmentDetail from './ApartmentDetail';

const W = 340, H = 380;
const BOUNDS = { latMin: 38.785, latMax: 38.999, lngMin: -77.130, lngMax: -76.900 };

function toSvg(lat, lng) {
  const x = ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * W;
  const y = ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * H;
  return { x, y };
}

const dcPts = [
  toSvg(38.994, -77.020), // N
  toSvg(38.893, -76.911), // E
  toSvg(38.788, -77.038), // S
  toSvg(38.893, -77.120), // W
].map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

export default function MapScreen() {
  const [listView, setListView] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);

  if (selectedApt) {
    return <ApartmentDetail apt={selectedApt} onBack={() => setSelectedApt(null)} />;
  }

  if (listView) {
    return (
      <div className="map-screen">
        <div className="top-bar">
          <button className="back-btn" onClick={() => setListView(false)}>‹</button>
          <h1>Apartment List</h1>
        </div>
        <div className="apt-list-view">
          {allApartments.map(apt => (
            <div key={apt.id} className="apt-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedApt(apt)}>
              <img src={apt.photo} alt={apt.neighborhood} />
              <div className="apt-card-body">
                <div className="apt-price">{apt.price}</div>
                <div className="apt-neighborhood">{apt.neighborhood}</div>
                <div className="apt-address">{apt.address}</div>
                <div className="apt-specs">{apt.beds}BR / {apt.baths}BA &middot; {apt.sqft} sqft &middot; {apt.availability}</div>
                <button className="apt-link">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="map-screen">
      <div className="top-bar">
        <button className="back-btn" style={{ visibility: 'hidden' }}>‹</button>
        <h1>Map of Apartments</h1>
      </div>
      <div className="map-search-row">
        <div className="map-search-wrap">
          <span className="map-search-icon">🔍</span>
          <input className="map-search-input" placeholder="Explore Apartments" readOnly />
        </div>
        <button className="map-filter-btn">⚙</button>
      </div>
      <div className="map-container">
        <svg viewBox={`0 0 ${W} ${H}`} className="map-svg" xmlns="http://www.w3.org/2000/svg">
          <rect width={W} height={H} fill="#f2ede8" />
          {[60,110,160,210,260,310].map(y => (
            <line key={'h'+y} x1="0" y1={y} x2={W} y2={y} stroke="#e5dfd9" strokeWidth="1" />
          ))}
          {[50,100,150,200,250,300].map(x => (
            <line key={'v'+x} x1={x} y1="0" x2={x} y2={H} stroke="#e5dfd9" strokeWidth="1" />
          ))}
          {/* Potomac */}
          <path d="M 40 350 Q 100 360 160 330 Q 200 315 240 328 Q 280 342 320 334"
            fill="none" stroke="#b8d4ea" strokeWidth="20" strokeLinecap="round" opacity="0.75" />
          {/* DC diamond */}
          <polygon points={dcPts} fill="rgba(194,24,91,0.13)" stroke="#C2185B" strokeWidth="2.5" />
          {/* Price pins */}
          {allApartments.map(apt => {
            const { x, y } = toSvg(apt.lat, apt.lng);
            const label = apt.price.replace('/mo', '');
            return (
              <g key={apt.id} transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}
                 style={{ cursor: 'pointer' }} onClick={() => setSelectedApt(apt)}>
                <filter id="ps" x="-20%" y="-20%" width="140%" height="160%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                </filter>
                <rect x="-36" y="-16" width="72" height="24" rx="8"
                      fill="white" stroke="#e8d0d8" strokeWidth="1" filter="url(#ps)" />
                <text x="-26" y="3" fontSize="10" fill="#C2185B">🏠</text>
                <text x="-10" y="3" fontSize="11" fontWeight="600" fill="#1a1a1a"
                      fontFamily="-apple-system, sans-serif">{label}</text>
                <polygon points="-4,8 4,8 0,15" fill="white" />
              </g>
            );
          })}
        </svg>
        <button className="map-show-list-btn" onClick={() => setListView(true)}>
          Show List
        </button>
      </div>
    </div>
  );
}
