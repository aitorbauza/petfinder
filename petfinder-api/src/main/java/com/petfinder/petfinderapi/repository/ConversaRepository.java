package com.petfinder.petfinderapi.repository;

import com.petfinder.petfinderapi.model.Conversa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversaRepository extends JpaRepository<Conversa, Long> {
}