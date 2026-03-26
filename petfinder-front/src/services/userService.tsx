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
      // error de red o servidor caído
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
}) => {
  return axios.post(`${API_URL}/crear`, userData);
};