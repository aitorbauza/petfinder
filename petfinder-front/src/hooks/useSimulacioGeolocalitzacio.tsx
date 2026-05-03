import { useEffect, useRef, useCallback } from 'react';
import { geolocalitzacioService } from '../services/geolocalitzacioService';

interface UseSimulacioGeolocalitzacioProps {
  mascotaId: number;
  teGeolocalitzacio: boolean;
  intervalMs?: number; // per defecte: 5000ms (5 segons)
  onUbicacioActualitzada?: (lat: number, lng: number) => void;
}

export const useSimulacioGeolocalitzacio = ({
  mascotaId,
  teGeolocalitzacio,
  intervalMs = 5000,
  onUbicacioActualitzada,
}: UseSimulacioGeolocalitzacioProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isSimulantRef = useRef(false);

  const iniciarSimulacio = useCallback(async () => {
    if (!teGeolocalitzacio || isSimulantRef.current) return;

    isSimulantRef.current = true;

    // Simular moviment periòdicament
    intervalRef.current = setInterval(async () => {
      try {
        const novaUbicacio = await geolocalitzacioService.simularMoviment(mascotaId);
        onUbicacioActualitzada?.(novaUbicacio.latitud, novaUbicacio.longitud);
      } catch (error) {
        console.error(`Error simulant moviment per mascota ${mascotaId}:`, error);
      }
    }, intervalMs);
  }, [mascotaId, teGeolocalitzacio, intervalMs, onUbicacioActualitzada]);

  const aturarSimulacio = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isSimulantRef.current = false;
  }, []);

  useEffect(() => {
    if (teGeolocalitzacio) {
      iniciarSimulacio();
    } else {
      aturarSimulacio();
    }

    return () => {
      aturarSimulacio();
    };
  }, [teGeolocalitzacio, iniciarSimulacio, aturarSimulacio]);

  return { isSimulant: isSimulantRef.current };
};