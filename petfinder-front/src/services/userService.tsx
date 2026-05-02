import axios from 'axios';

const API_URL = 'http://localhost:9090/api/usuaris';

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || 'Credenciales incorrectas');
    } else {
      throw new Error('No se pudo conectar con el servidor');
    }
  }
};

export const registerUser = (userData: {
  nom: string;
  email: string;
  password: string;
  telefon?: string;
  rol?: string;
  imatgeUrl?: string | null;
}) => {
  return axios.post(`${API_URL}/crear`, userData);
};

export const actualitzarUsuari = async (usuariId: number, data: { nom: string; telefon: string }) => {
  const response = await axios.put(`${API_URL}/${usuariId}`, data);
  return response.data;
};

export const pujarImatgePerfil = async (file: File, usuariId: number): Promise<string> => {
  const formData = new FormData();
  formData.append('fitxer', file);
  
  const response = await axios.post(`${API_URL}/pujar-perfil?usuariId=${usuariId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data.url;
};

export const eliminarImatgePerfil = async (usuariId: number): Promise<void> => {
  try {
    const response = await axios.delete(`${API_URL}/${usuariId}/imatge-perfil`);
    return response.data;
  } catch (error: any) {
    console.error('Error detallat:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Error eliminant la imatge');
  }
};