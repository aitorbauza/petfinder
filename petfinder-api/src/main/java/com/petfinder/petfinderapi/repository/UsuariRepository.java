package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Usuari;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuariRepository extends JpaRepository<Usuari, Long> {
    Optional<Usuari> findByEmail(String email);

    Optional<Usuari> findByTelefon(String telefon);

    boolean existsByEmail(String email);

}