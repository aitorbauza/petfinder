// services/ubicacioService.ts
import axios from 'axios';

interface UbicacioInfo {
  ciutat: string;
  provincia: string;
  displayName: string;
}

// Geolocalització inversa amb BigDataCloud (gratuït, sense CORS)
export const getUbicacioFromCoords = async (lat: number, lng: number): Promise<UbicacioInfo | null> => {
  try {
    const response = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      params: {
        latitude: lat,
        longitude: lng,
        localityLanguage: 'ca' // Català
      }
    });
    
    const data = response.data;
    
    // BigDataCloud retorna:
    // - city: ciutat
    // - principalSubdivision: província/comunitat
    // - locality: barri/poble
    const ciutat = data.city || data.locality || data.town || data.village || '';
    const provincia = data.principalSubdivision || '';
    
    return {
      ciutat: ciutat || 'Ubicació desconeguda',
      provincia: provincia,
      displayName: provincia && ciutat ? `${provincia} - ${ciutat}` : ciutat || provincia
    };
  } catch (error) {
    console.error('Error obtenint ubicació:', error);
    return null;
  }
};