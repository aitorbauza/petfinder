package com.petfinder.petfinderapi.scheduler;

import com.petfinder.petfinderapi.model.Mascota;
import com.petfinder.petfinderapi.repository.MascotaRepository;
import com.petfinder.petfinderapi.service.GeolocalitzacioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@EnableScheduling
public class GeolocalitzacioScheduler {

    private static final Logger log = LoggerFactory.getLogger(GeolocalitzacioScheduler.class);

    private final MascotaRepository mascotaRepository;
    private final GeolocalitzacioService geolocalitzacioService;

    public GeolocalitzacioScheduler(MascotaRepository mascotaRepository, GeolocalitzacioService geolocalitzacioService) {
        this.mascotaRepository = mascotaRepository;
        this.geolocalitzacioService = geolocalitzacioService;
    }

    /**
     * Cada 5 segons, genera un moviment aleatori per a totes les mascotes amb geolocalització activa
     */
    @Scheduled(fixedDelay = 5000)
    public void simularMoviments() {
        List<Mascota> mascotesAmbGeo = mascotaRepository.findByTeGeolocalitzacioTrue();

        if (mascotesAmbGeo.isEmpty()) {
            return;
        }

        log.info("🔄 Simulant moviment per a {} mascotes amb geolocalització", mascotesAmbGeo.size());

        for (Mascota mascota : mascotesAmbGeo) {
            try {
                geolocalitzacioService.generarMovimentAleatori(mascota.getMascotaId());
            } catch (Exception e) {
                log.error("Error simulant moviment per a mascota {}: {}", mascota.getMascotaId(), e.getMessage());
            }
        }
    }
}