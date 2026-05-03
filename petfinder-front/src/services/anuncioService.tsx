import axios from 'axios';

// Constants
const API_URL = 'http://localhost:9090/api/anuncis';

// Tipus
export interface PostAnunciDTO {
  nomMascota: string;
  especieId: number;
  raca: string;
  descripcio: string;
  latitud: number;
  longitud: number;
  estatId: number;
  imatgeUrl: string | null;
  ciutat: string;
  provincia: string;
}

export interface GetAnunciDTO {
  id: number;
  latitud: number;
  longitud: number;
  data: string;
  estat: string;
  nomMascota: string;
  especie: string;
  especieId: number;
  raca: string;
  descripcio: string;
  imatgeUrl: string | null;
  ciutat: string;
  provincia: string;
  usuariId: number;       
  usuariNom: string;       
  usuariTelefon: string;   
}

// Mètodes
export const crearAnuncio = (usuariId: number, anuncioData: PostAnunciDTO) => {
  return axios.post<{ message: string }>(`${API_URL}/crear`, anuncioData, {
    params: { usuariId }
  });
};

export const obtenerAnuncios = () => {
  return axios.get<GetAnunciDTO[]>(`${API_URL}/obtenir`);
};

export const obtenirAnuncisPropis = (usuariId: number) => {
  return axios.get<GetAnunciDTO[]>(`${API_URL}/meus`, {
    params: { usuariId }
  });
};

export const obtenirAnunciPerId = (anunciId: number) => {
  return axios.get<GetAnunciDTO>(`${API_URL}/${anunciId}`);
};

export const actualitzarAnunci = (anunciId: number, usuariId: number, anuncioData: PostAnunciDTO) => {
  return axios.put<{ message: string }>(`${API_URL}/${anunciId}`, anuncioData, {
    params: { usuariId }
  });
};

export const eliminarAnunci = (anunciId: number, usuariId: number) => {
  return axios.delete<{ message: string }>(`${API_URL}/${anunciId}`, {
    params: { usuariId }
  });
};