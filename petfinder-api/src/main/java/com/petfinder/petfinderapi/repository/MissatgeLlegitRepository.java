package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.MissatgeLlegit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface MissatgeLlegitRepository extends JpaRepository<MissatgeLlegit, Long> {

    List<MissatgeLlegit> findByUsuari_UsuariIdAndLlegitFalse(Long usuariId);

    long countByUsuari_UsuariIdAndLlegitFalse(Long usuariId);

    @Modifying
    @Transactional
    @Query("UPDATE MissatgeLlegit ml SET ml.llegit = true, ml.dataLlegit = CURRENT_TIMESTAMP WHERE ml.missatge.id IN :missatgeIds AND ml.usuari.usuariId = :usuariId")
    void marcarComLlegits(@Param("missatgeIds") List<Long> missatgeIds, @Param("usuariId") Long usuariId);
}