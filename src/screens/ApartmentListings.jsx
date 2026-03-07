import { useState } from 'react';
import ApartmentDetail from './ApartmentDetail';

export default function ApartmentListings({ person, onBack }) {
  const [selectedApt, setSelectedApt] = useState(null);

  if (selectedApt) {
    return <ApartmentDetail apt={selectedApt} onBack={() => setSelectedApt(null)} />;
  }

  return (
    <div className="apt-panel">
      <div className="apt-panel-header">
        <span className="apt-panel-chevron" onClick={onBack}>⌃</span>
        <div className="apt-panel-title">{person.name}&apos;s Apartment Listings</div>
      </div>
      <div className="apt-scroll">
        {person.apartments.map(apt => (
          <div key={apt.id} className="apt-card">
            <img src={apt.photo} alt={apt.neighborhood} />
            <div className="apt-card-body">
              <div className="apt-price">{apt.price}</div>
              <div className="apt-neighborhood">{apt.neighborhood}</div>
              <div className="apt-address">{apt.address}</div>
              <div className="apt-specs">
                {apt.beds}BR / {apt.baths}BA &middot; {apt.sqft} sqft &middot; {apt.availability}
              </div>
              <button className="apt-link" onClick={() => setSelectedApt(apt)}>
                View Details
              </button>
            </div>
          </div>
        ))}

        <div className="person-profile-card">
          <div className="person-profile-card-header">{person.name}&apos;s Profile</div>
          <div className="person-profile-card-body">
            <img src={person.photo} alt={person.name} />
            <div>
              <h3>{person.name}, {person.age}</h3>
              <p>{person.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
