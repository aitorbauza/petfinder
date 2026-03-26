import axios from 'axios';

const API_URL = 'http://localhost:9090/api/anuncis';

export const crearAnuncio = (usuariId: number, anuncioData: any) => {
  return axios.post(`${API_URL}/crear?usuariId=${usuariId}`, anuncioData);
};

export const obtenerAnuncios = () => {
  return axios.get(`${API_URL}/obtenir`);
};