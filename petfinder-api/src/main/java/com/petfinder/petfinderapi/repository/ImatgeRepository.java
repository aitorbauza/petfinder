package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Imatge;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ImatgeRepository extends JpaRepository<Imatge, Long> {
}