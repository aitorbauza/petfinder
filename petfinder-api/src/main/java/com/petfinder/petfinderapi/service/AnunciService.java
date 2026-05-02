package com.petfinder.petfinderapi.service;

import com.petfinder.petfinderapi.dto.request.GetAnunciDTO;
import com.petfinder.petfinderapi.dto.request.PostAnunciDTO;
import com.petfinder.petfinderapi.mapper.AnunciMapper;
import com.petfinder.petfinderapi.model.*;
import com.petfinder.petfinderapi.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnunciService {

    private final AnunciRepository anunciRepository;
    private final MascotaRepository mascotaRepository;
    private final EstatRepository estatRepository;
    private final EspecieRepository especieRepository;
    private final UsuariRepository usuariRepository;
    private final ImatgeRepository imatgeRepository;

    public AnunciService(
            AnunciRepository anunciRepository,
            MascotaRepository mascotaRepository,
            EstatRepository estatRepository,
            EspecieRepository especieRepository,
            UsuariRepository usuariRepository,
            ImatgeRepository imatgeRepository) {
        this.anunciRepository = anunciRepository;
        this.mascotaRepository = mascotaRepository;
        this.estatRepository = estatRepository;
        this.especieRepository = especieRepository;
        this.usuariRepository = usuariRepository;
        this.imatgeRepository = imatgeRepository;
    }

    @Transactional
    public void crearAnunci(PostAnunciDTO dto, Long usuariId) throws Exception {

        // Buscar usuario
        Usuari usuari = usuariRepository.findById(usuariId)
                .orElseThrow(() -> new Exception("Usuari no trobat"));

        Mascota mascota;

        if (dto.getMascotaId() != null) {
            // Mascota existente
            mascota = mascotaRepository.findById(dto.getMascotaId())
                    .orElseThrow(() -> new Exception("Mascota no trobat"));
        } else {
            // Mascota nueva
            Especie especie = especieRepository.findById(dto.getEspecieId())
                    .orElseThrow(() -> new Exception("Especie no trobada"));

            mascota = new Mascota();
            mascota.setNom(dto.getNomMascota());
            mascota.setDescripcio(dto.getDescripcio());
            mascota.setEspecie(especie);
            mascota.setUsuari(usuari);

            if (dto.getRaca() != null && !dto.getRaca().isEmpty()) {
                mascota.setRaca(dto.getRaca());
            } else {
                mascota.setRaca("Sense raça"); // Valor por defecto si no se proporciona raza
            }

            // Guardam la mascota per obtenir un ID
            mascota = mascotaRepository.save(mascota);
            System.out.println("✅ Mascota guardada amb ID: " + mascota.getMascotaId());

            // Guardam la imatge (ara la mascota ja té ID)
            if (dto.getImatgeUrl() != null && !dto.getImatgeUrl().isEmpty()) {
                Imatge imatge = new Imatge();
                imatge.setUrl(dto.getImatgeUrl());
                imatge.setMascota(mascota);
                imatgeRepository.save(imatge);
            }
        }

        Estat estat = estatRepository.findById(dto.getEstatId())
                .orElseThrow(() -> new RuntimeException("Estat no encontrado"));

        Anunci anunci = new Anunci();
        anunci.setMascota(mascota);
        anunci.setEstat(estat);
        anunci.setLatitud(dto.getLatitud());
        anunci.setLongitud(dto.getLongitud());
        anunci.setData(LocalDateTime.now());
        anunci.setCiutat(dto.getCiutat());
        anunci.setProvincia(dto.getProvincia());

        anunciRepository.save(anunci);
    }

    public List<GetAnunciDTO> llistarAnuncis() {
        return anunciRepository.findAll()
                .stream()
                .map(AnunciMapper::toGetDTO)
                .collect(Collectors.toList());
    }

    public List<GetAnunciDTO> llistarAnuncisPerUsuari(Long usuariId) {
        return anunciRepository.findByMascota_Usuari_UsuariId(usuariId)
                .stream()
                .map(AnunciMapper::toGetDTO)
                .collect(Collectors.toList());
    }
}