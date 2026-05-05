package com.petfinder.petfinderapi.service;

import com.petfinder.petfinderapi.dto.ConversaDTO;
import com.petfinder.petfinderapi.dto.MissatgeDTO;
import com.petfinder.petfinderapi.dto.request.EnviarMissatgeDTO;
import com.petfinder.petfinderapi.exception.BusinessException;
import com.petfinder.petfinderapi.model.*;
import com.petfinder.petfinderapi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MissatgeService {

    private final ConversaRepository conversaRepository;
    private final MissatgeRepository missatgeRepository;
    private final MissatgeLlegitRepository missatgeLlegitRepository;
    private final UsuariRepository usuariRepository;

    public MissatgeService(
            ConversaRepository conversaRepository,
            MissatgeRepository missatgeRepository,
            MissatgeLlegitRepository missatgeLlegitRepository,
            UsuariRepository usuariRepository) {
        this.conversaRepository = conversaRepository;
        this.missatgeRepository = missatgeRepository;
        this.missatgeLlegitRepository = missatgeLlegitRepository;
        this.usuariRepository = usuariRepository;
    }

    @Transactional
    public void enviarMissatge(EnviarMissatgeDTO dto) {
        Usuari remitent = usuariRepository.findById(dto.getUsuariId())
                .orElseThrow(() -> new BusinessException("Usuari no trobat"));

        Usuari destinatari = usuariRepository.findById(dto.getDestinatariId())
                .orElseThrow(() -> new BusinessException("Destinatari no trobat"));

        Conversa conversa;

        if (dto.getConversaId() != null && dto.getConversaId() > 0) {
            conversa = conversaRepository.findById(dto.getConversaId())
                    .orElseThrow(() -> new BusinessException("Conversa no trobada"));
        } else {
            // Buscar si ja existeix conversa entre aquests dos usuaris
            Optional<Conversa> existing = conversaRepository.findConversaBetweenUsuaris(remitent.getUsuariId(), destinatari.getUsuariId());
            if (existing.isPresent()) {
                conversa = existing.get();
            } else {
                conversa = new Conversa();
                List<Usuari> usuaris = new ArrayList<>();
                usuaris.add(remitent);
                usuaris.add(destinatari);
                conversa.setUsuaris(usuaris);
                conversa = conversaRepository.save(conversa);
            }
        }

        Missatge missatge = new Missatge();
        missatge.setContingut(dto.getContingut());
        missatge.setData(LocalDateTime.now());
        missatge.setConversa(conversa);
        missatge.setUsuari(remitent);
        missatge = missatgeRepository.save(missatge);

        // Marcar per al destinatari (no llegit)
        MissatgeLlegit llegitDesti = new MissatgeLlegit();
        llegitDesti.setMissatge(missatge);
        llegitDesti.setUsuari(destinatari);
        llegitDesti.setLlegit(false);
        missatgeLlegitRepository.save(llegitDesti);

        // Marcar per al remitent (llegit)
        MissatgeLlegit llegitRemitent = new MissatgeLlegit();
        llegitRemitent.setMissatge(missatge);
        llegitRemitent.setUsuari(remitent);
        llegitRemitent.setLlegit(true);
        llegitRemitent.setDataLlegit(LocalDateTime.now());
        missatgeLlegitRepository.save(llegitRemitent);
    }

    public List<ConversaDTO> obtenirConversesPerUsuari(Long usuariId) {
        List<Conversa> converses = conversaRepository.findConversesByUsuariId(usuariId);

        return converses.stream().map(conversa -> {
            ConversaDTO dto = new ConversaDTO();
            dto.setConversaId(conversa.getConversaId());

            // Trobar l'altre usuari
            Usuari altreUsuari = conversa.getUsuaris().stream()
                    .filter(u -> !u.getUsuariId().equals(usuariId))
                    .findFirst()
                    .orElse(null);

            if (altreUsuari != null) {
                dto.setAltreUsuariNom(altreUsuari.getNom());
                dto.setAltreUsuariId(altreUsuari.getUsuariId());
                dto.setAltreUsuariImatgeUrl(altreUsuari.getImatgeUrl());
            }

            // Últim missatge
            List<Missatge> missatges = missatgeRepository.findByConversa_ConversaIdOrderByDataAsc(conversa.getConversaId());
            if (!missatges.isEmpty()) {
                Missatge last = missatges.get(missatges.size() - 1);
                dto.setUltimMissatge(last.getContingut());
                dto.setUltimMissatgeData(last.getData());
            }

            int noLlegits = (int) missatgeLlegitRepository.countByUsuari_UsuariIdAndLlegitFalse(usuariId);
            dto.setMissatgesNoLlegits(noLlegits);

            return dto;
        }).collect(Collectors.toList());
    }

    public List<MissatgeDTO> obtenirMissatgesPerConversa(Long conversaId, Long usuariId) {
        List<Missatge> missatges = missatgeRepository.findByConversa_ConversaIdOrderByDataAsc(conversaId);

        List<MissatgeDTO> result = missatges.stream().map(m -> {
            MissatgeDTO dto = new MissatgeDTO();
            dto.setId(m.getId());
            dto.setContingut(m.getContingut());
            dto.setData(m.getData());
            dto.setUsuariId(m.getUsuari().getUsuariId());
            dto.setUsuariNom(m.getUsuari().getNom());
            dto.setEsMeu(m.getUsuari().getUsuariId().equals(usuariId));
            return dto;
        }).collect(Collectors.toList());

        // Marcar com llegits
        List<Long> missatgeIdsNoLlegits = missatges.stream()
                .filter(m -> !m.getUsuari().getUsuariId().equals(usuariId))
                .map(Missatge::getId)
                .collect(Collectors.toList());

        if (!missatgeIdsNoLlegits.isEmpty()) {
            missatgeLlegitRepository.marcarComLlegits(missatgeIdsNoLlegits, usuariId);
        }

        return result;
    }

    public int obtenirTotalMissatgesNoLlegits(Long usuariId) {
        return missatgeLlegitRepository.findByUsuari_UsuariIdAndLlegitFalse(usuariId).size();
    }
}