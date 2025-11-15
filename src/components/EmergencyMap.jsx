import React, { useEffect, useRef } from 'react';

const EmergencyMap = () => {
  const mapContainer = useRef(null);

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
        
        // Ajouter la couche satellite
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Satellite Esri'
        }).addTo(map);

        // Ajouter la couche OpenStreetMap en backup
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap'
        }).addTo(map);

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

  }, []);

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
