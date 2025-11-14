import { useState, useEffect } from 'react';

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000,
    ...options
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      setLoading(false);
      return;
    }

    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
      setError(null);
      setLoading(false);
    };

    const errorHandler = (error) => {
      let errorMessage = 'Impossible d\'obtenir votre position';
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permission de localisation refusée. Autorisez la localisation dans les paramètres de votre navigateur.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Information de localisation indisponible';
          break;
        case error.TIMEOUT:
          errorMessage = 'La demande de localisation a expiré';
          break;
        default:
          errorMessage = 'Erreur inconnue lors de la géolocalisation';
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      successHandler, 
      errorHandler, 
      defaultOptions
    );

    // Optionnel: surveiller les changements de position
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      defaultOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Erreur lors de la nouvelle tentative';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position indisponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Temps écoulé';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      defaultOptions
    );
  };

  return { location, error, loading, refetch };
};

export default useGeolocation;