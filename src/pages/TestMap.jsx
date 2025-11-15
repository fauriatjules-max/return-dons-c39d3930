import React, { useState } from 'react';
import EmergencyMap from '../components/EmergencyMap';

const TestMap = () => {
  const [debugInfo, setDebugInfo] = useState('');

  const checkLeaflet = () => {
    const info = {
      leafletLoaded: !!window.L,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    };
    setDebugInfo(JSON.stringify(info, null, 2));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2E8B57' }}>🧪 Test de la Carte</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkLeaflet}
          style={{
            background: '#2E8B57',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Vérifier le statut Leaflet
        </button>
        
        {debugInfo && (
          <pre style={{
            background: '#f4f4f4',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '10px',
            fontSize: '12px'
          }}>
            {debugInfo}
          </pre>
        )}
      </div>

      <EmergencyMap />

      <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
        <h3>Instructions de dépannage :</h3>
        <ol>
          <li>Cliquez sur "Vérifier le statut Leaflet"</li>
          <li>Si Leaflet n'est pas chargé, contactez le support</li>
          <li>Donnez-leur les informations de debug ci-dessus</li>
        </ol>
      </div>
    </div>
  );
};

export default TestMap;
