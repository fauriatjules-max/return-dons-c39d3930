import React, { useEffect, useRef } from 'react';

const EmergencyMap = ({ donations = [] }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Vérifier si on peut charger Leaflet
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        // Vérifier si Leaflet est déjà chargé
        if (window.L) {
          resolve(window.L);
          return;
        }

        // Charger CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Charger JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        script.onload = () => resolve(window.L);
        script.onerror = () => reject(new Error('Leaflet failed to load'));
        
        document.head.appendChild(script);
      });
    };

    loadLeaflet()
      .then(L => {
        if (!mapContainer.current) return;

        // Créer la carte
        const map = L.map(mapContainer.current).setView([48.8566, 2.3522], 13);
        mapInstance.current = map;
        
        // Ajouter la couche satellite
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Satellite Esri'
        }).addTo(map);

        // Ajouter la couche OpenStreetMap en backup
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap'
        }).addTo(map);

        // Ajouter les marqueurs pour les donations
        donations.forEach(donation => {
          if (donation.location?.coordinates) {
            const [lng, lat] = donation.location.coordinates;
            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(`
              <div style="padding: 5px;">
                <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${donation.title}</h3>
                <p style="margin: 0; font-size: 12px;">${donation.description}</p>
              </div>
            `);
            markersRef.current.push(marker);
          }
        });

        // Ajuster la vue si on a des donations
        if (donations.length > 0 && donations[0].location?.coordinates) {
          const [lng, lat] = donations[0].location.coordinates;
          map.setView([lat, lng], 12);
        }

        console.log('Carte créée avec succès!');
      })
      .catch(error => {
        console.error('Erreur chargement carte:', error);
        // Afficher un message d'erreur
        if (mapContainer.current) {
          mapContainer.current.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              background: #f8f9fa;
              border-radius: 10px;
              padding: 20px;
              text-align: center;
            ">
              <h3>🌍 Carte temporairement indisponible</h3>
              <p>Nous rencontrons un problème technique avec le chargement de la carte.</p>
              <button onclick="window.location.reload()" style="
                background: #2E8B57;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
              ">
                Réessayer
              </button>
            </div>
          `;
        }
      });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [donations]);

  return (
    <div>
      <div 
        ref={mapContainer}
        style={{
          height: '500px',
          width: '100%',
          borderRadius: '10px',
          border: '2px solid #2E8B57',
          background: '#f8f9fa'
        }}
      />
    </div>
  );
};

export default EmergencyMap;
