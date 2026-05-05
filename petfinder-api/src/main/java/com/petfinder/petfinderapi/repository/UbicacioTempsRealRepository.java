package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.UbicacioTempsReal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface UbicacioTempsRealRepository extends JpaRepository<UbicacioTempsReal, Long> {

    // Obtenir l'última ubicació activa d'una mascota
    Optional<UbicacioTempsReal> findFirstByMascota_MascotaIdAndActiuTrueOrderByTimestampDesc(Long mascotaId);

    // Obtenir totes les ubicacions actives (per al mapa)
    @Query("SELECT u FROM UbicacioTempsReal u WHERE u.actiu = true AND u.mascota.teGeolocalitzacio = true")
    List<UbicacioTempsReal> findAllUbicacionsActives();

    // Desactivar ubicacions anteriors d'una mascota
    @Modifying
    @Transactional
    @Query("UPDATE UbicacioTempsReal u SET u.actiu = false WHERE u.mascota.mascotaId = :mascotaId AND u.actiu = true")
    void desactivarUbicacionsAnteriors(@Param("mascotaId") Long mascotaId);
}