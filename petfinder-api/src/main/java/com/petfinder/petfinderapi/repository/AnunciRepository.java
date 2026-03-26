package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Anunci;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnunciRepository extends JpaRepository<Anunci, Long> {

    List<Anunci> findByMascota_MascotaId(Long mascotaId);

    List<Anunci> findByEstat_EstatId(Long estatId);
}