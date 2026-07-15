import React from 'react';

function KioskCard({ name, id, onSelect }) {
  return (
    <div className="kiosk-card" onClick={() => onSelect(name, id)}>
      <div className="kiosk-icon">🏪</div>
      <div className="kiosk-card-info">
        <h3>{name}</h3>
        <small>ID: {id}</small>
      </div>
      <div className="kiosk-arrow">➔</div>
    </div>
  );
}

export default KioskCard;