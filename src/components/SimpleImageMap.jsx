import React, { useState } from 'react';

const SimpleImageMap = () => {
  const [userLocation, setUserLocation] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          alert('Géolocalisation impossible: ' + error.message);
        }
      );
    } else {
      alert('Géolocalisation non supportée');
    }
  };

  // URL d'une image statique de carte (OpenStreetMap)
  const getStaticMapUrl = () => {
    if (userLocation) {
      return `https://static-maps.yandex.ru/1.x/?ll=${userLocation.lng},${userLocation.lat}&z=13&l=map&size=650,400`;
    }
    return 'https://static-maps.yandex.ru/1.x/?ll=2.3522,48.8566&z=13&l=map&size=650,400'; // Paris par défaut
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>🗺️ Carte Simplifiée</h2>
      
      <button 
        onClick={getLocation}
        style={{
          background: '#2E8B57',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      >
        📍 Afficher ma position sur la carte
      </button>

      {userLocation && (
        <div style={{ 
          background: '#D1ECF1', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          ✅ Position trouvée: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </div>
      )}

      <div style={{
        border: '2px solid #2E8B57',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0 auto',
        maxWidth: '650px'
      }}>
        <img 
          src={getStaticMapUrl()} 
          alt="Carte"
          style={{ 
            width: '100%', 
            height: '400px',
            display: 'block'
          }}
        />
      </div>

      <div style={{ 
        marginTop: '15px', 
        color: '#666',
        fontSize: '14px'
      }}>
        {userLocation ? (
          <p>📍 Vous êtes localisé sur la carte</p>
        ) : (
          <p>Cliquez sur le bouton pour vous localiser</p>
        )}
      </div>
    </div>
  );
};

export default SimpleImageMap;
