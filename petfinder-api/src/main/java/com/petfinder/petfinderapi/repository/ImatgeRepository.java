package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Imatge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImatgeRepository extends JpaRepository<Imatge, Long> {

    List<Imatge> findByMascota_MascotaId(Long mascotaId);
}