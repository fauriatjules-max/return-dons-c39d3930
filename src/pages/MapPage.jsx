import React, { useState, useEffect } from 'react';
import FreeSatelliteMap from '@/components/FreeSatelliteMap';
import useGeolocation from '@/hooks/useGeolocation';
import { supabase } from '@/integrations/supabase/client';

const MapPage = () => {
  const { location, error: locationError, loading: locationLoading, refetch: refetchLocation } = useGeolocation();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [filter, setFilter] = useState('all');

  // Charger les dons
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('donations')
          .select(`
            *,
            donor:profiles!donations_donor_id_fkey(
              id,
              display_name
            ),
            category:categories(name)
          `)
          .eq('status', 'disponible')
          .not('location', 'is', null)
          .limit(100);
        
        if (error) throw error;
        
        if (data) {
          setDonations(data);
        }
      } catch (error) {
        console.error('Erreur chargement dons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Filtrer les dons
  const filteredDonations = filter === 'all' 
    ? donations 
    : donations.filter(don => don.category?.name === filter);

  const handleDonationSelect = (donation) => {
    setSelectedDonation(donation);
    console.log('Don sélectionné:', donation);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        textAlign: 'center'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2E8B57',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p>Chargement de la carte et des dons...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* En-tête */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ 
          margin: '0 0 8px 0', 
          color: '#2E8B57',
          fontSize: '28px'
        }}>
          🗺️ Carte des Dons
        </h1>
        <p style={{ 
          margin: '0 0 16px 0', 
          color: '#6C757D',
          fontSize: '16px'
        }}>
          Découvrez les dons disponibles près de chez vous - 100% gratuit
        </p>

        {/* Filtres */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          flexWrap: 'wrap',
          marginBottom: '16px'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: filter === 'all' ? '#2E8B57' : 'white',
              color: filter === 'all' ? 'white' : '#333',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('nourriture')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: filter === 'nourriture' ? '#FF7F50' : 'white',
              color: filter === 'nourriture' ? 'white' : '#333',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            🍎 Nourriture
          </button>
          <button
            onClick={() => setFilter('objets')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: filter === 'objets' ? '#2E8B57' : 'white',
              color: filter === 'objets' ? 'white' : '#333',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            📦 Objets
          </button>
          <button
            onClick={() => setFilter('vetements')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '20px',
              background: filter === 'vetements' ? '#9370DB' : 'white',
              color: filter === 'vetements' ? 'white' : '#333',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            👕 Vêtements
          </button>
        </div>

        {/* Statut géolocalisation */}
        <div style={{ 
          padding: '12px', 
          borderRadius: '8px',
          background: locationLoading ? '#FFF3CD' : 
                     locationError ? '#F8D7DA' : 
                     location ? '#D1ECF1' : '#E2E3E5',
          color: locationLoading ? '#856404' : 
                 locationError ? '#721C24' : 
                 location ? '#0C5460' : '#383D41',
          marginBottom: '16px'
        }}>
          {locationLoading && '📍 Recherche de votre position...'}
          {locationError && `⚠️ ${locationError}`}
          {location && `✅ Position détectée - ${filteredDonations.length} dons disponibles`}
          {!location && !locationLoading && !locationError && '📍 Cliquez sur "Ma position" pour vous localiser'}
          
          {locationError && (
            <button 
              onClick={refetchLocation}
              style={{
                marginLeft: '12px',
                padding: '4px 8px',
                background: 'transparent',
                border: '1px solid currentColor',
                borderRadius: '4px',
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              Réessayer
            </button>
          )}
        </div>
      </div>

      {/* Carte */}
      <div style={{ 
        height: '60vh', 
        minHeight: '500px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <FreeSatelliteMap
          donations={filteredDonations}
          userLocation={location}
          onDonationSelect={handleDonationSelect}
          initialZoom={location ? 13 : 10}
          height="100%"
        />
      </div>

      {/* Dons à proximité */}
      {location && filteredDonations.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>
            🎁 Dons à proximité ({filteredDonations.length})
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {filteredDonations.slice(0, 6).map(donation => (
              <div 
                key={donation.id}
                style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => handleDonationSelect(donation)}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ margin: 0, color: '#2E8B57' }}>
                    {donation.title}
                  </h4>
                  <span style={{
                    background: getCategoryColor(donation.category?.name),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {getCategoryName(donation.category?.name)}
                  </span>
                </div>
                <p style={{ 
                  margin: '8px 0',
                  color: '#666',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {donation.description?.substring(0, 100)}...
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#6C757D'
                }}>
                  <span>Par {donation.donor?.display_name || 'Anonyme'}</span>
                  <span>{new Date(donation.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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

export default MapPage;