import axios from 'axios';
import type { UbicacioTempsReal } from '../interfaces/geolocalitzacio';

const API_URL = 'http://localhost:9090/api/ubicacions';

export const geolocalitzacioService = {

  obtenirUltimaUbicacio: async (mascotaId: number): Promise<UbicacioTempsReal | null> => {
    try {
      const response = await axios.get<UbicacioTempsReal>(`${API_URL}/ultima/${mascotaId}`);
      return response.data;
    } catch (error) {
      console.error('Error obtenint ubicació:', error);
      return null;
    }
  },

  obtenirTotesUbicacionsActives: async (): Promise<UbicacioTempsReal[]> => {
    const response = await axios.get<UbicacioTempsReal[]>(`${API_URL}/actives`);
    return response.data;
  },

  simularMoviment: async (mascotaId: number): Promise<UbicacioTempsReal> => {
    const response = await axios.post<UbicacioTempsReal>(`${API_URL}/simular/${mascotaId}`);
    return response.data;
  },
};