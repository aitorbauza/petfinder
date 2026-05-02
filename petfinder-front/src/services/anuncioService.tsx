import axios from 'axios';

const API_URL = 'http://localhost:9090/api/anuncis';

export const crearAnuncio = (usuariId: number, anuncioData: {  // Dades necessàries per crear un anunci
  nomMascota: string;
  especieId: number;
  raca: string | null;
  descripcio: string;
  latitud: number;
  longitud: number;
  estatId: number;
  imatgeUrl: string | null;
  ciutat: string;
  provincia: string;
}) => {
  return axios.post(`${API_URL}/crear?usuariId=${usuariId}`, anuncioData);
};

export const obtenerAnuncios = () => {
  return axios.get(`${API_URL}/obtenir`);
};

export const obtenirAnuncisPropis = (usuariId: number) => {
  return axios.get(`${API_URL}/meus?usuariId=${usuariId}`);
};