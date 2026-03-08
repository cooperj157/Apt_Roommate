import { useState } from 'react';

export default function ApartmentDetail({ apt, onBack }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="detail-overlay">
      <div className="top-bar">
        <button className="back-btn" onClick={onBack}>‹</button>
        <h1>Apartment Details</h1>
      </div>
      <img className="detail-hero" src={apt.photo} alt={apt.neighborhood} />
      <div className="detail-body">
        <div className="detail-price">{apt.price}</div>
        <div className="detail-neighborhood">{apt.neighborhood}</div>
        <div className="detail-address">{apt.address}</div>

        <div className="detail-chips">
          <span className="detail-chip">🛏 {apt.beds} Bed</span>
          <span className="detail-chip">🚿 {apt.baths} Bath</span>
          <span className="detail-chip">📐 {apt.sqft} sqft</span>
        </div>

        <div className="detail-avail">
          Availability: <strong>{apt.availability}</strong>
        </div>

        {apt.description && (
          <div className="detail-description">{apt.description}</div>
        )}

        {apt.amenities && apt.amenities.length > 0 && (
          <div className="detail-amenities">
            <div className="detail-amenities-title">Amenities</div>
            <div className="detail-chips">
              {apt.amenities.map(a => (
                <span key={a} className="detail-chip">{a}</span>
              ))}
            </div>
          </div>
        )}

        {apt.landlord && (
          <div className="detail-landlord">Listed by: <strong>{apt.landlord}</strong></div>
        )}

        <button
          className={`detail-add-btn${added ? ' added' : ''}`}
          onClick={() => setAdded(true)}
        >
          {added ? '✓ Added to Profile' : '+ Add Apartment to Profile'}
        </button>

        <a
          className="detail-zillow-btn"
          href={`https://www.zillow.com/homes/${encodeURIComponent(apt.address.replace(/,/g, '').replace(/\s+/g, '-'))}_rb/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Zillow ↗
        </a>

        <button className="detail-contact-btn">Contact Landlord</button>
      </div>
    </div>
  );
}
