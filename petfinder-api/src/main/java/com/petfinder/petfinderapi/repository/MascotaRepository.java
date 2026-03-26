package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    List<Mascota> findByUsuari_UsuariId(Long usuariId);

    List<Mascota> findByEspecie_EspecieId(Long especieId);
}