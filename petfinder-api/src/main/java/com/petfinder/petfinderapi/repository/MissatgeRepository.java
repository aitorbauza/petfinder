package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Missatge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MissatgeRepository extends JpaRepository<Missatge, Long> {

    List<Missatge> findByConversa_ConversaIdOrderByDataAsc(Long conversaId);

    @Query("SELECT COUNT(m) FROM Missatge m WHERE m.conversa.conversaId = :conversaId AND m.usuari.usuariId != :usuariId")
    int countMissatgesNoLlegitsPerConversa(@Param("conversaId") Long conversaId, @Param("usuariId") Long usuariId);
}