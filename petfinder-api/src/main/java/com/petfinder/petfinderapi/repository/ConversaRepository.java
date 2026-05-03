package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Conversa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ConversaRepository extends JpaRepository<Conversa, Long> {

    @Query(value = "SELECT c.* FROM conversa c " +
            "JOIN usuari_conversa uc ON c.conversa_id = uc.id_conversa " +
            "WHERE uc.id_usuari = :usuariId", nativeQuery = true)
    List<Conversa> findConversesByUsuariId(@Param("usuariId") Long usuariId);

    @Query(value = "SELECT c.* FROM conversa c " +
            "JOIN usuari_conversa uc1 ON c.conversa_id = uc1.id_conversa " +
            "JOIN usuari_conversa uc2 ON c.conversa_id = uc2.id_conversa " +
            "WHERE uc1.id_usuari = :usuari1Id AND uc2.id_usuari = :usuari2Id", nativeQuery = true)
    Optional<Conversa> findConversaBetweenUsuaris(@Param("usuari1Id") Long usuari1Id, @Param("usuari2Id") Long usuari2Id);
}