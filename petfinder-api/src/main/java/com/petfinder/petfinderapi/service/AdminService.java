package com.petfinder.petfinderapi.service;

import com.petfinder.petfinderapi.dto.AnunciAdminDTO;
import com.petfinder.petfinderapi.dto.UsuariAdminDTO;
import com.petfinder.petfinderapi.dto.request.PostAnunciDTO;
import com.petfinder.petfinderapi.exception.BusinessException;
import com.petfinder.petfinderapi.model.*;
import com.petfinder.petfinderapi.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final AnunciRepository anunciRepository;
    private final UsuariRepository usuariRepository;
    private final MascotaRepository mascotaRepository;
    private final ImatgeRepository imatgeRepository;
    private final ConversaRepository conversaRepository;
    private final MissatgeRepository missatgeRepository;
    private final MissatgeLlegitRepository missatgeLlegitRepository;
    private final FileStorageService fileStorageService;
    private final EspecieRepository especieRepository;
    private final EstatRepository estatRepository;

    public AdminService(
            AnunciRepository anunciRepository,
            UsuariRepository usuariRepository,
            MascotaRepository mascotaRepository,
            ImatgeRepository imatgeRepository,
            ConversaRepository conversaRepository,
            MissatgeRepository missatgeRepository,
            MissatgeLlegitRepository missatgeLlegitRepository,
            FileStorageService fileStorageService, EspecieRepository especieRepository, EstatRepository estatRepository) {
        this.anunciRepository = anunciRepository;
        this.usuariRepository = usuariRepository;
        this.mascotaRepository = mascotaRepository;
        this.imatgeRepository = imatgeRepository;
        this.conversaRepository = conversaRepository;
        this.missatgeRepository = missatgeRepository;
        this.missatgeLlegitRepository = missatgeLlegitRepository;
        this.fileStorageService = fileStorageService;
        this.especieRepository = especieRepository;
        this.estatRepository = estatRepository;
    }

    public List<AnunciAdminDTO> obtenirTotsElsAnuncis() {
        return anunciRepository.findAll().stream()
                .map(this::convertirAnunciADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarAnunci(Long anunciId) {
        Anunci anunci = anunciRepository.findById(anunciId)
                .orElseThrow(() -> new BusinessException("Anunci no trobat"));

        Mascota mascota = anunci.getMascota();

        // Eliminar imatges físiques de la mascota
        if (mascota.getImatges() != null && !mascota.getImatges().isEmpty()) {
            for (Imatge imatge : mascota.getImatges()) {
                try {
                    fileStorageService.deleteFile(imatge.getUrl());
                } catch (Exception e) {
                    log.error("Error eliminant imatge: {}", e.getMessage());
                }
            }
            imatgeRepository.deleteAll(mascota.getImatges());
            mascota.getImatges().clear();
        }

        // Eliminar l'anunci
        anunciRepository.delete(anunci);

        // Eliminar la mascota si no té més anuncis
        List<Anunci> anuncisMascota = anunciRepository.findByMascota_MascotaId(mascota.getMascotaId());
        if (anuncisMascota == null || anuncisMascota.isEmpty()) {
            mascotaRepository.delete(mascota);
        }

        log.info("Admin ha eliminat l'anunci {}", anunciId);
    }

    public List<UsuariAdminDTO> obtenirTotsElsUsuaris() {
        return usuariRepository.findAll().stream()
                .map(this::convertirUsuariADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarUsuari(Long usuariId) {
        Usuari usuari = usuariRepository.findById(usuariId)
                .orElseThrow(() -> new BusinessException("Usuari no trobat"));

        // Eliminar imatge de perfil física
        if (usuari.getImatgeUrl() != null && !usuari.getImatgeUrl().isEmpty()) {
            try {
                fileStorageService.deleteFile(usuari.getImatgeUrl());
            } catch (Exception e) {
                log.error("Error eliminant imatge de perfil: {}", e.getMessage());
            }
        }

        // Eliminar converses de l'usuari
        List<Conversa> converses = conversaRepository.findConversesByUsuariId(usuariId);
        for (Conversa conversa : converses) {
            // Eliminar missatges llegits associats
            for (Missatge missatge : conversa.getMissatges()) {
                missatgeLlegitRepository.deleteAll(missatge.getMissatgesLlegits());
            }
            missatgeRepository.deleteAll(conversa.getMissatges());
        }
        conversaRepository.deleteAll(converses);

        // Eliminar les mascotes de l'usuari (i els seus anuncis)
        List<Mascota> mascotes = mascotaRepository.findByUsuari_UsuariId(usuariId);
        for (Mascota mascota : mascotes) {
            // Eliminar imatges de la mascota
            if (mascota.getImatges() != null && !mascota.getImatges().isEmpty()) {
                for (Imatge imatge : mascota.getImatges()) {
                    try {
                        fileStorageService.deleteFile(imatge.getUrl());
                    } catch (Exception e) {
                        log.error("Error eliminant imatge de mascota: {}", e.getMessage());
                    }
                }
            }
        }
        mascotaRepository.deleteAll(mascotes);

        // Finalment, eliminar l'usuari
        usuariRepository.delete(usuari);
        log.info("Admin ha eliminat l'usuari {}", usuariId);
    }

    @Transactional
    public void editarAnunciAdmin(Long anunciId, PostAnunciDTO dto) {
        Anunci anunci = anunciRepository.findById(anunciId)
                .orElseThrow(() -> new BusinessException("Anunci no trobat"));

        Mascota mascota = anunci.getMascota();

        // Actualitzar dades de la mascota
        mascota.setNom(dto.getNomMascota());
        mascota.setRaca(dto.getRaca() != null && !dto.getRaca().isEmpty() ? dto.getRaca() : "Sin raza");
        mascota.setDescripcio(dto.getDescripcio());

        if (dto.getEspecieId() != null) {
            Especie especie = especieRepository.findById(dto.getEspecieId())
                    .orElseThrow(() -> new BusinessException("Especie no trobada"));
            mascota.setEspecie(especie);
        }

        // Actualitzar imatge si s'ha pujat una de nova
        if (dto.getImatgeUrl() != null && !dto.getImatgeUrl().isEmpty()) {
            if (mascota.getImatges() != null && !mascota.getImatges().isEmpty()) {
                for (Imatge imatge : mascota.getImatges()) {
                    try {
                        fileStorageService.deleteFile(imatge.getUrl());
                    } catch (Exception e) {
                        log.error("Error eliminant imatge: {}", e.getMessage());
                    }
                }
                imatgeRepository.deleteAll(mascota.getImatges());
                mascota.getImatges().clear();
            }

            Imatge novaImatge = new Imatge();
            novaImatge.setUrl(dto.getImatgeUrl());
            novaImatge.setMascota(mascota);
            imatgeRepository.save(novaImatge);

            if (mascota.getImatges() == null) {
                mascota.setImatges(new ArrayList<>());
            }
            mascota.getImatges().add(novaImatge);
        }

        mascotaRepository.save(mascota);

        // Actualitzar dades de l'anunci
        Estat estat = estatRepository.findById(dto.getEstatId())
                .orElseThrow(() -> new BusinessException("Estat no trobat"));

        anunci.setEstat(estat);
        anunci.setLatitud(dto.getLatitud());
        anunci.setLongitud(dto.getLongitud());
        anunci.setCiutat(dto.getCiutat());
        anunci.setProvincia(dto.getProvincia());

        anunciRepository.save(anunci);
        log.info("Admin ha editat l'anunci {}", anunciId);
    }

    @Transactional
    public void editarUsuari(Long usuariId, Map<String, String> data) {
        Usuari usuari = usuariRepository.findById(usuariId)
                .orElseThrow(() -> new BusinessException("Usuari no trobat"));

        if (data.containsKey("nom")) {
            usuari.setNom(data.get("nom"));
        }
        if (data.containsKey("telefon")) {
            String nouTelefon = data.get("telefon");
            // Validar que no existeixi un altre usuari amb aquest telèfon
            Optional<Usuari> existingUser = usuariRepository.findByTelefon(nouTelefon);
            if (existingUser.isPresent() && !existingUser.get().getUsuariId().equals(usuariId)) {
                throw new BusinessException("El telèfon ja està en ús per un altre usuari");
            }
            usuari.setTelefon(nouTelefon);
        }
        if (data.containsKey("rol")) {
            usuari.setRol(data.get("rol"));
        }

        usuariRepository.save(usuari);
        log.info("Admin ha editat l'usuari {}", usuariId);
    }

    private AnunciAdminDTO convertirAnunciADTO(Anunci anunci) {
        AnunciAdminDTO dto = new AnunciAdminDTO();
        dto.setId(anunci.getAnunciId());
        dto.setMascotaId(anunci.getMascota().getMascotaId());
        dto.setNomMascota(anunci.getMascota().getNom());
        dto.setEspecie(anunci.getMascota().getEspecie().getNom());
        dto.setRaca(anunci.getMascota().getRaca());
        dto.setDescripcio(anunci.getMascota().getDescripcio());
        dto.setEstat(anunci.getEstat().getNom());
        dto.setLatitud(anunci.getLatitud());
        dto.setLongitud(anunci.getLongitud());
        dto.setCiutat(anunci.getCiutat());
        dto.setProvincia(anunci.getProvincia());
        dto.setData(anunci.getData() != null ? anunci.getData().toString() : null);
        dto.setUsuariId(anunci.getMascota().getUsuari().getUsuariId());
        dto.setUsuariNom(anunci.getMascota().getUsuari().getNom());

        if (anunci.getMascota().getImatges() != null && !anunci.getMascota().getImatges().isEmpty()) {
            dto.setImatgeUrl(anunci.getMascota().getImatges().get(0).getUrl());
        }

        return dto;
    }

    private UsuariAdminDTO convertirUsuariADTO(Usuari usuari) {
        UsuariAdminDTO dto = new UsuariAdminDTO();
        dto.setUsuariId(usuari.getUsuariId());
        dto.setNom(usuari.getNom());
        dto.setEmail(usuari.getEmail());
        dto.setTelefon(usuari.getTelefon());
        dto.setRol(usuari.getRol());
        dto.setImatgeUrl(usuari.getImatgeUrl());
        return dto;
    }
}