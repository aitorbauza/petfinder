package com.petfinder.petfinderapi.service;

import com.petfinder.petfinderapi.dto.UbicacioTempsRealDTO;
import com.petfinder.petfinderapi.exception.BusinessException;
import com.petfinder.petfinderapi.model.Mascota;
import com.petfinder.petfinderapi.model.UbicacioTempsReal;
import com.petfinder.petfinderapi.repository.MascotaRepository;
import com.petfinder.petfinderapi.repository.UbicacioTempsRealRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class GeolocalitzacioService {

    private static final Logger log = LoggerFactory.getLogger(GeolocalitzacioService.class);
    private static final Random random = new Random();

    // Radi de moviment en graus (~111 metres per 0.001 graus)
    private static final double RADI_MOVIMENT = 0.003;
    private static final double RADI_MAXIM = 0.01; // ~1km de radi màxim des del punt inicial

    private final UbicacioTempsRealRepository ubicacioRepository;
    private final MascotaRepository mascotaRepository;

    public GeolocalitzacioService(
            UbicacioTempsRealRepository ubicacioRepository,
            MascotaRepository mascotaRepository) {
        this.ubicacioRepository = ubicacioRepository;
        this.mascotaRepository = mascotaRepository;
    }

    public void guardarUbicacio(Long mascotaId, Double latitud, Double longitud) {
        Mascota mascota = mascotaRepository.findById(mascotaId)
                .orElseThrow(() -> new BusinessException("Mascota no trobada"));

        // Desactivar ubicacions anteriors
        ubicacioRepository.desactivarUbicacionsAnteriors(mascotaId);

        // Guardar nova ubicació
        UbicacioTempsReal ubicacio = new UbicacioTempsReal();
        ubicacio.setMascota(mascota);
        ubicacio.setLatitud(latitud);
        ubicacio.setLongitud(longitud);
        ubicacio.setTimestamp(LocalDateTime.now());
        ubicacio.setActiu(true);

        ubicacioRepository.save(ubicacio);
        log.info("📍 Ubicació guardada per a mascota {}: ({}, {})", mascotaId, latitud, longitud);
    }

    public UbicacioTempsRealDTO generarMovimentAleatori(Long mascotaId) {
        UbicacioTempsRealDTO ubicacioActual = obtenirUltimaUbicacio(mascotaId);

        if (ubicacioActual == null) {
            throw new BusinessException("No s'ha trobat la ubicació inicial de la mascota");
        }

        // Moviment aleatori (fins a 0.002 graus ~200m)
        double desplacament = 0.002;
        double novaLat = ubicacioActual.getLatitud() + (Math.random() - 0.5) * desplacament;
        double novaLng = ubicacioActual.getLongitud() + (Math.random() - 0.5) * desplacament;

        guardarUbicacio(mascotaId, novaLat, novaLng);

        return obtenirUltimaUbicacio(mascotaId);
    }


     // Obtenir l'última ubicació activa d'una mascota
    public UbicacioTempsRealDTO obtenirUltimaUbicacio(Long mascotaId) {
        return ubicacioRepository.findFirstByMascota_MascotaIdAndActiuTrueOrderByTimestampDesc(mascotaId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    //Obtenir totes les ubicacions actives (per al mapa)
    public List<UbicacioTempsRealDTO> obtenirTotesUbicacionsActives() {
        return ubicacioRepository.findAllUbicacionsActives()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private double calcularNovaCoordenada(double coordenadaActual) {
        // Moviment aleatori entre -RADI_MOVIMENT i +RADI_MOVIMENT
        double desplaçament = (random.nextDouble() - 0.5) * 2 * RADI_MOVIMENT;
        return coordenadaActual + desplaçament;
    }

    private UbicacioTempsRealDTO convertToDTO(UbicacioTempsReal entity) {
        UbicacioTempsRealDTO dto = new UbicacioTempsRealDTO();
        dto.setId(entity.getId());
        dto.setMascotaId(entity.getMascota().getMascotaId());
        dto.setLatitud(entity.getLatitud());
        dto.setLongitud(entity.getLongitud());
        dto.setTimestamp(entity.getTimestamp());
        dto.setActiu(entity.getActiu());
        return dto;
    }
}