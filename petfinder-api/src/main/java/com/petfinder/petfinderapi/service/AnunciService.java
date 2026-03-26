package com.petfinder.petfinderapi.service;

import com.petfinder.petfinderapi.dto.request.GetAnunciDTO;
import com.petfinder.petfinderapi.dto.request.PostAnunciDTO;
import com.petfinder.petfinderapi.mapper.AnunciMapper;
import com.petfinder.petfinderapi.model.*;
import com.petfinder.petfinderapi.repository.*;
import org.springframework.stereotype.Service;

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

    public AnunciService(
            AnunciRepository anunciRepository,
            MascotaRepository mascotaRepository,
            EstatRepository estatRepository,
            EspecieRepository especieRepository,
            UsuariRepository usuariRepository) {
        this.anunciRepository = anunciRepository;
        this.mascotaRepository = mascotaRepository;
        this.estatRepository = estatRepository;
        this.especieRepository = especieRepository;
        this.usuariRepository = usuariRepository;
    }

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
            mascota.setRaca(dto.getRaca());
            mascota.setDescripcio(dto.getDescripcio());
            mascota.setEspecie(especie);
            mascota.setUsuari(usuari);

            mascota = mascotaRepository.save(mascota);
        }

        Estat estat = estatRepository.findById(dto.getEstatId())
                .orElseThrow(() -> new RuntimeException("Estat no encontrado"));

        Anunci anunci = new Anunci();
        anunci.setMascota(mascota);
        anunci.setEstat(estat);
        anunci.setLatitud(dto.getLatitud());
        anunci.setLongitud(dto.getLongitud());
        anunci.setData(LocalDateTime.now());

        anunciRepository.save(anunci);
    }

    public List<GetAnunciDTO> llistarAnuncis() {
        return anunciRepository.findAll()
                .stream()
                .map(AnunciMapper::toGetDTO)
                .collect(Collectors.toList());
    }
}