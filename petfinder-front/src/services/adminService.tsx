import axios from 'axios';

const API_URL = 'http://localhost:9090/api/admin';

export interface UsuariAdminDTO {
  usuariId: number;
  nom: string;
  email: string;
  telefon: string;
  rol: string;
  imatgeUrl: string | null;
}

export interface AnunciAdminDTO {
  id: number;
  mascotaId: number;
  nomMascota: string;
  especie: string;
  raca: string;
  descripcio: string;
  estat: string;
  latitud: number;
  longitud: number;
  ciutat: string;
  provincia: string;
  data: string;
  usuariId: number;
  usuariNom: string;
  imatgeUrl: string | null;
}

// Obtenir tots els anuncis (admin)
export const obtenirTotsElsAnuncis = () => {
  return axios.get<AnunciAdminDTO[]>(`${API_URL}/anuncis`);
};

// Obtenir tots els usuaris (admin)
export const obtenirTotsElsUsuaris = () => {
  return axios.get<UsuariAdminDTO[]>(`${API_URL}/usuaris`);
};

// Eliminar un anunci (admin)
export const eliminarAnunciAdmin = (anunciId: number) => {
  return axios.delete(`${API_URL}/anuncis/${anunciId}`);
};

// Eliminar un usuari (admin)
export const eliminarUsuariAdmin = (usuariId: number) => {
  return axios.delete(`${API_URL}/usuaris/${usuariId}`);
};

// Editar un usuari (admin)
export const editarUsuariAdmin = (usuariId: number, data: { nom: string; telefon: string; rol: string }) => {
  return axios.put(`${API_URL}/usuaris/${usuariId}`, data);
};

export const editarAnunciAdmin = (anunciId: number, anunciData: any) => {
  return axios.put(`${API_URL}/anuncis/${anunciId}`, anunciData);
};