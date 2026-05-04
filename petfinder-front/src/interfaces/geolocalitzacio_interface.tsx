export interface UbicacioTempsReal {
  id: number;
  mascotaId: number;
  latitud: number;
  longitud: number;
  timestamp: string;
  actiu: boolean;
}

export interface MascotaAmbGeolocalitzacio {
  mascotaId: number;
  nom: string;
  teGeolocalitzacio: boolean;
  microchipId: string | null;
  ultimaUbicacio?: UbicacioTempsReal;
}