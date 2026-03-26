package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Estat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstatRepository extends JpaRepository<Estat, Long> {
}