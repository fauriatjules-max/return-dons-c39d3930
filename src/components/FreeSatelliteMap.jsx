import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet dans React
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

// Styles CSS personnalisés
const mapStyles = `
  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: 12px;
    z-index: 1;
  }
  
  .custom-popup .leaflet-popup-content-wrapper {
    border-radius: 12px;
    padding: 8px;
  }
  
  .donation-marker {
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
  }
  
  .new-donation-marker {
    animation: bounceIn 0.8s ease-out, glow 2s ease-in-out;
  }
  
  .user-location-marker {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes bounceIn {
    0% {
      transform: scale(0) translateY(-50px);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) translateY(0);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes glow {
    0%, 100% {
      filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
    }
    50% {
      filter: drop-shadow(0 0 20px rgba(46, 139, 87, 0.8)) drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
    }
  }
`;

// Fournisseurs de tuiles GRATUITS
const TILE_PROVIDERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  topographic: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

// Icônes personnalisées par catégorie
const createCustomIcon = (category, isUserLocation = false, isNew = false) => {
  const colors = {
    nourriture: '#FF7F50',
    objets: '#2E8B57', 
    vetements: '#9370DB',
    electronique: '#4169E1',
    autre: '#6C757D'
  };
  
  const color = colors[category] || colors['autre'];
  
  if (isUserLocation) {
    return L.divIcon({
      html: `
        <div style="
          background-color: #4169E1;
          width: 20px;
          height: 20px;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      className: 'user-location-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  }
  
  // Icône SVG personnalisée pour les dons
  const svg = `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15c0 15 15 25 15 25s15-10 15-25c0-8.284-6.716-15-15-15z" 
            fill="${color}" stroke="#ffffff" stroke-width="2"/>
      <text x="15" y="22" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🎁</text>
    </svg>
  `;
  
  return L.divIcon({
    html: svg,
    className: isNew ? 'donation-marker new-donation-marker' : 'donation-marker',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40]
  });
};

// Composant pour changer la vue de la carte
function MapController({ mapType, setMapType }) {
  const map = useMap();
  
  useEffect(() => {
    // Recentrer la carte si nécessaire
    map.invalidateSize();
  }, [map, mapType]);
  
  return null;
}

// Composant pour les événements de la carte
function MapEvents({ onMapClick, onMapMove }) {
  useMapEvents({
    click: onMapClick,
    move: onMapMove
  });
  return null;
}

const FreeSatelliteMap = ({ 
  donations = [], 
  newDonationIds = [],
  onDonationSelect,
  userLocation = null,
  initialZoom = 12,
  height = "600px"
}) => {
  const [mapType, setMapType] = useState('satellite');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [currentCenter, setCurrentCenter] = useState([48.8566, 2.3522]); // Paris par défaut
  const mapRef = useRef();

  // Centrer sur la position utilisateur
  useEffect(() => {
    if (userLocation) {
      setCurrentCenter([userLocation.latitude, userLocation.longitude]);
    }
  }, [userLocation]);

  // Calcul de distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}km`;
  };

  // Obtenir la position utilisateur
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setCurrentCenter(newCenter);
          if (mapRef.current) {
            mapRef.current.setView(newCenter, 15);
          }
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          alert('Impossible d\'obtenir votre position. Vérifiez les permissions.');
        }
      );
    }
  };

  const handleDonationClick = (donation) => {
    setSelectedDonation(donation);
    if (onDonationSelect) {
      onDonationSelect(donation);
    }
  };

  return (
    <div className="free-map-container" style={{ height, position: 'relative' }}>
      <style>{mapStyles}</style>
      
      {/* Contrôles de la carte */}
      <div className="map-controls" style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Sélecteur de type de carte */}
        <div className="map-type-selector" style={{
          background: 'white',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          gap: '4px'
        }}>
          {Object.keys(TILE_PROVIDERS).map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: '4px',
                background: mapType === type ? '#2E8B57' : '#f8f9fa',
                color: mapType === type ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {type === 'satellite' ? '🛰️' : 
               type === 'topographic' ? '🏔️' :
               type === 'street' ? '🗺️' : '🌙'}
            </button>
          ))}
        </div>

        {/* Bouton localisation */}
        <button 
          onClick={getUserLocation}
          style={{
            background: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          📍 Ma position
        </button>

        {/* Légende */}
        <div className="map-legend" style={{
          background: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          fontSize: '12px'
        }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Légende:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#FF7F50', borderRadius: '2px' }}></div>
              Nourriture
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#2E8B57', borderRadius: '2px' }}></div>
              Objets
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#9370DB', borderRadius: '2px' }}></div>
              Vêtements
            </div>
          </div>
        </div>
      </div>

      {/* Carte Leaflet */}
      <MapContainer
        center={currentCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <MapController mapType={mapType} setMapType={setMapType} />
        <MapEvents />
        
        {/* Couche de tuiles */}
        <TileLayer
          url={TILE_PROVIDERS[mapType].url}
          attribution={TILE_PROVIDERS[mapType].attribution}
        />

        {/* Marqueur position utilisateur */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createCustomIcon('', true)}
          >
            <Popup>
              <div style={{ padding: '8px' }}>
                <strong>📍 Votre position</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marqueurs des dons */}
        {donations.map((donation) => {
          if (!donation.location?.coordinates) return null;
          
          const position = [
            donation.location.coordinates[1], 
            donation.location.coordinates[0]
          ];
          
          const isNew = newDonationIds.includes(donation.id);

          return (
            <Marker
              key={donation.id}
              position={position}
              icon={createCustomIcon(donation.category, false, isNew)}
              eventHandlers={{
                click: () => handleDonationClick(donation)
              }}
            >
              <Popup className="custom-popup">
                <div style={{ minWidth: '200px', padding: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2E8B57' }}>
                    {donation.title}
                  </h4>
                  
                  <div style={{ 
                    display: 'inline-block', 
                    background: getCategoryColor(donation.category),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginBottom: '8px'
                  }}>
                    {getCategoryName(donation.category)}
                  </div>
                  
                  <p style={{ 
                    margin: '8px 0', 
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    {donation.description?.substring(0, 100)}...
                  </p>
                  
                  {userLocation && (
                    <p style={{ 
                      margin: '8px 0', 
                      fontSize: '12px',
                      color: '#2E8B57',
                      fontWeight: '500'
                    }}>
                      📍 {calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        position[0],
                        position[1]
                      )}
                    </p>
                  )}
                  
                  <button
                    onClick={() => handleDonationClick(donation)}
                    style={{
                      width: '100%',
                      background: '#2E8B57',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginTop: '8px'
                    }}
                  >
                    Voir les détails
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Statistiques */}
      <div className="map-stats" style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        background: 'rgba(255,255,255,0.9)',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <strong>{donations.length}</strong> dons affichés
      </div>
    </div>
  );
};

// Fonctions utilitaires
const getCategoryColor = (category) => {
  const colors = {
    'nourriture': '#FF7F50',
    'objets': '#2E8B57',
    'vetements': '#9370DB', 
    'electronique': '#4169E1',
    'autre': '#6C757D'
  };
  return colors[category] || colors['autre'];
};

const getCategoryName = (category) => {
  const names = {
    'nourriture': 'Nourriture',
    'objets': 'Objets',
    'vetements': 'Vêtements',
    'electronique': 'Électronique',
    'autre': 'Autre'
  };
  return names[category] || names['autre'];
};

export default FreeSatelliteMap;