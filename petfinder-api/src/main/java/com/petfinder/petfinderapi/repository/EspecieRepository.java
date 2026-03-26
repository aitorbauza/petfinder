package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Especie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EspecieRepository extends JpaRepository<Especie, Long> {
    Optional<Especie> findByNom(String nom);
}