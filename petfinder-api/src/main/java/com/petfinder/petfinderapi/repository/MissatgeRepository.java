package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Missatge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MissatgeRepository extends JpaRepository<Missatge, Long> {

    List<Missatge> findByConversa_ConversaId(Long conversaId);
}