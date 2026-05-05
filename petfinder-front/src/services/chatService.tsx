import axios from 'axios';

const API_URL = 'http://localhost:9090/api/missatges';

export interface ConversaDTO {
  conversaId: number;
  altreUsuariNom: string;
  altreUsuariId: number;
  altreUsuariImatgeUrl: string | null;
  ultimMissatge: string;
  ultimMissatgeData: string;
  missatgesNoLlegits: number;
}

export interface MissatgeDTO {
  id: number;
  contingut: string;
  data: string;
  usuariId: number;
  usuariNom: string;
  esMeu: boolean;
  llegit: boolean;
}

export interface EnviarMissatgeDTO {
  conversaId?: number;
  anunciId?: number;
  destinatariId: number;
  contingut: string;
  usuariId: number;
}

export const obtenirConverses = (usuariId: number) => {
  return axios.get<ConversaDTO[]>(`${API_URL}/converses`, {
    params: { usuariId }
  });
};

export const obtenirMissatges = (conversaId: number, usuariId: number) => {
  return axios.get<MissatgeDTO[]>(`${API_URL}/conversa/${conversaId}`, {
    params: { usuariId }
  });
};

export const enviarMissatge = (dto: EnviarMissatgeDTO) => {
  return axios.post(`${API_URL}/enviar`, dto);
};

export const obtenirMissatgesNoLlegits = (usuariId: number) => {
  return axios.get<number>(`${API_URL}/no-llegits`, {
    params: { usuariId }
  });
};