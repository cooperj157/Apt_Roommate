import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { allApartments } from '../data/dummy';
import rentcastRaw from '../data/rentcast.json';
import ApartmentDetail from './ApartmentDetail';

// Fix Leaflet default icon path issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makePriceIcon(price, color = '#1A7A85') {
  const label = `$${Number(price).toLocaleString()}`;
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background: white;
        border: 2px solid ${color};
        border-radius: 8px;
        padding: 4px 8px;
        font-size: 12px;
        font-weight: 700;
        color: #1a1a1a;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        position: relative;
        font-family: -apple-system, sans-serif;
      ">
        <span style="color:${color}; margin-right:3px;">🏠</span>${label}/mo
        <div style="
          position: absolute; bottom: -7px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid ${color};
        "></div>
      </div>`,
    iconAnchor: [40, 36],
    iconSize: [80, 36],
  });
}

function normalizeRentcast(l) {
  return {
    id: l.id,
    price: `$${Number(l.price).toLocaleString()}/mo`,
    neighborhood: l.city ? `${l.city}, ${l.state}` : 'Washington, DC',
    address: l.formattedAddress || l.addressLine1 || '',
    beds: l.bedrooms ?? '?',
    baths: l.bathrooms ?? '?',
    sqft: l.squareFootage ?? '?',
    availability: 'Available Now',
    photo: l.photoUrls?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    description: l.description || '',
    amenities: [],
    landlord: l.listedBy || '',
    lat: l.latitude,
    lng: l.longitude,
    rawPrice: l.price,
  };
}

const liveListings = Array.isArray(rentcastRaw) && rentcastRaw.length > 0
  ? rentcastRaw.filter(l => l.latitude && l.longitude && l.price).map(normalizeRentcast)
  : null;

const listings = liveListings?.length ? liveListings : allApartments;
const isLive = !!(liveListings?.length);

// Suppress map re-render flicker when parent re-renders
function ClickableMarkers({ listings, onSelect }) {
  const map = useMap();
  return listings.map(apt => (
    <Marker
      key={apt.id}
      position={[apt.lat, apt.lng]}
      icon={makePriceIcon(apt.rawPrice || apt.price.replace(/[^0-9]/g, ''))}
      eventHandlers={{
        click: () => {
          map.panTo([apt.lat, apt.lng], { animate: true });
          onSelect(apt);
        },
      }}
    />
  ));
}

export default function MapScreen() {
  const [selectedApt, setSelectedApt] = useState(null);
  const [listView, setListView] = useState(false);

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
        {!isLive && <div className="map-status map-status-warn">Showing sample data</div>}
        <div className="apt-list-view">
          {listings.map(apt => (
            <div key={apt.id} className="apt-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedApt(apt)}>
              <img src={apt.photo} alt={apt.neighborhood} />
              <div className="apt-card-body">
                <div className="apt-price">{apt.price}</div>
                <div className="apt-neighborhood">{apt.neighborhood}</div>
                <div className="apt-address">{apt.address}</div>
                <div className="apt-specs">{apt.beds}BR / {apt.baths}BA · {apt.sqft} sqft · {apt.availability}</div>
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
        <MapContainer
          center={[38.9072, -77.0369]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickableMarkers listings={listings} onSelect={setSelectedApt} />
        </MapContainer>
        <button className="map-show-list-btn" onClick={() => setListView(true)}>
          Show List
        </button>
      </div>
    </div>
  );
}
