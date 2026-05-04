package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Usuari;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuariRepository extends JpaRepository<Usuari, Long> {
    Optional<Usuari> findByEmail(String email);

    Optional<Usuari> findByTelefon(String telefon);

    boolean existsByEmail(String email);

    boolean existsByTelefon(String telefon);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuari u WHERE u.telefon = :telefon AND u.usuariId != :usuariId")
    boolean existsByTelefonAndUsuariIdNot(@Param("telefon") String telefon, @Param("usuariId") Long usuariId);

}