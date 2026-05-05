package com.petfinder.petfinderapi.service;

import com.petfinder.petfinderapi.dto.request.GetAnunciDTO;
import com.petfinder.petfinderapi.dto.request.PostAnunciDTO;
import com.petfinder.petfinderapi.exception.BusinessException;
import com.petfinder.petfinderapi.mapper.AnunciMapper;
import com.petfinder.petfinderapi.model.*;
import com.petfinder.petfinderapi.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnunciService {

    private static final Logger log = LoggerFactory.getLogger(AnunciService.class);
    private static final String RACA_PER_DEFECTE = "Sense raça";
    private static final String DESCRIPCIO_PER_DEFECTE = "Sense descripció";

    private final AnunciRepository anunciRepository;
    private final MascotaRepository mascotaRepository;
    private final EstatRepository estatRepository;
    private final EspecieRepository especieRepository;
    private final UsuariRepository usuariRepository;
    private final ImatgeRepository imatgeRepository;
    private final FileStorageService fileStorageService;
    private final GeolocalitzacioService geolocalitzacioService;

    public AnunciService(
            AnunciRepository anunciRepository,
            MascotaRepository mascotaRepository,
            EstatRepository estatRepository,
            EspecieRepository especieRepository,
            UsuariRepository usuariRepository,
            ImatgeRepository imatgeRepository,
            FileStorageService fileStorageService,
            GeolocalitzacioService geolocalitzacioService
    ) {
        this.anunciRepository = anunciRepository;
        this.mascotaRepository = mascotaRepository;
        this.estatRepository = estatRepository;
        this.especieRepository = especieRepository;
        this.usuariRepository = usuariRepository;
        this.imatgeRepository = imatgeRepository;
        this.fileStorageService = fileStorageService;
        this.geolocalitzacioService = geolocalitzacioService;
    }

    @Transactional
    public void crearAnunci(PostAnunciDTO dto, Long usuariId) {
        Usuari usuari = obtenirUsuariPerId(usuariId);
        Mascota mascota = crearOBuscarMascota(dto, usuari);

        Estat estat = obtenirEstatPerId(dto.getEstatId());
        Anunci anunci = construirAnunci(dto, mascota, estat);

        anunciRepository.save(anunci);

        if (mascota.getTeGeolocalitzacio() != null && mascota.getTeGeolocalitzacio()) {
            try {
                geolocalitzacioService.guardarUbicacio(mascota.getMascotaId(), dto.getLatitud(), dto.getLongitud());
            } catch (Exception e) {
                log.error("Error guardant ubicació inicial per a mascota {}: {}", mascota.getMascotaId(), e.getMessage());
                throw new BusinessException("Error guardant la ubicació inicial. Si us plau, intenta-ho més tard.");
            }
        }

        log.info("Anunci creat per usuari {}: {}", usuariId, anunci.getAnunciId());
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

    public GetAnunciDTO obtenirAnunciPerId(Long anunciId) {
        Anunci anunci = anunciRepository.findById(anunciId)
                .orElseThrow(() -> new BusinessException("Anunci no trobat"));
        return AnunciMapper.toGetDTO(anunci);
    }

    @Transactional
    public void actualitzarAnunci(Long anunciId, PostAnunciDTO dto, Long usuariId) {
        Anunci anunci = verificarPropietatAnunci(anunciId, usuariId);
        Mascota mascota = anunci.getMascota();

        boolean geolocalitzacioJaActiva = mascota.getTeGeolocalitzacio() != null && mascota.getTeGeolocalitzacio();
        boolean geolocalitzacioNovaActiva = dto.getTeGeolocalitzacio() != null && dto.getTeGeolocalitzacio();

        // Actualitzar dades bàsiques de la mascota
        actualitzarDadesMascota(mascota, dto);

        // Només actualitzar si hi ha canvis
        String imatgeExistentUrl = null;
        boolean teImatgeExistent = teImatges(mascota);
        if (teImatgeExistent) {
            imatgeExistentUrl = mascota.getImatges().get(0).getUrl();
        }

        String imatgeNovaUrl = dto.getImatgeUrl();
        boolean eliminarImatge = dto.getEliminarImatge() != null && dto.getEliminarImatge();

        // Comprovar si la imatge ha canviat realment
        boolean imatgeHaCanviat = false;

        if (eliminarImatge && teImatgeExistent) {
            imatgeHaCanviat = true;
        } else if (imatgeNovaUrl != null && !imatgeNovaUrl.isEmpty()) {
            // Si hi ha imatge nova i és diferent de l'existent
            if (imatgeExistentUrl == null || !imatgeNovaUrl.equals(imatgeExistentUrl)) {
                imatgeHaCanviat = true;
            }
        }

        // NOMÉS actualitzar la imatge si realment ha canviat
        if (imatgeHaCanviat) {
            actualitzarImatgeMascota(mascota, dto);
        }

        mascota.setTeGeolocalitzacio(geolocalitzacioNovaActiva);
        mascota.setMicrochipId(dto.getMicrochipId());

        mascotaRepository.save(mascota);

        if (geolocalitzacioNovaActiva && !geolocalitzacioJaActiva) {
            try {
                geolocalitzacioService.guardarUbicacio(mascota.getMascotaId(), dto.getLatitud(), dto.getLongitud());
            } catch (Exception e) {
                log.error("Error guardant ubicació inicial per a mascota {}: {}", mascota.getMascotaId(), e.getMessage());
            }
        }

        Estat estat = obtenirEstatPerId(dto.getEstatId());
        actualitzarDadesAnunci(anunci, dto, estat);

        anunciRepository.save(anunci);
        log.info("Anunci actualitzat: {}", anunciId);
    }

    @Transactional
    public void eliminarAnunci(Long anunciId, Long usuariId) {
        Anunci anunci = verificarPropietatAnunci(anunciId, usuariId);
        Mascota mascota = anunci.getMascota();

        eliminarImatgesDeMascota(mascota);
        anunciRepository.delete(anunci);

        eliminarMascotaSiNoTeAnuncis(mascota);
        log.info("Anunci eliminat: {}", anunciId);
    }

    // ==================== MÈTODES PRIVATS ====================
    private Usuari obtenirUsuariPerId(Long usuariId) {
        return usuariRepository.findById(usuariId)
                .orElseThrow(() -> new BusinessException("Usuari no trobat"));
    }

    private Estat obtenirEstatPerId(Long estatId) {
        return estatRepository.findById(estatId)
                .orElseThrow(() -> new BusinessException("Estat no trobat"));
    }

    private Especie obtenirEspeciePerId(Long especieId) {
        return especieRepository.findById(especieId)
                .orElseThrow(() -> new BusinessException("Especie no trobada"));
    }

    private Mascota crearOBuscarMascota(PostAnunciDTO dto, Usuari usuari) {
        if (dto.getMascotaId() != null) {
            return mascotaRepository.findById(dto.getMascotaId())
                    .orElseThrow(() -> new BusinessException("Mascota no trobada"));
        }

        Especie especie = obtenirEspeciePerId(dto.getEspecieId());
        Mascota mascota = construirMascota(dto, usuari, especie);
        mascota = mascotaRepository.save(mascota);

        guardarImatgeSiExisteix(dto.getImatgeUrl(), mascota);

        return mascota;
    }

    private Mascota construirMascota(PostAnunciDTO dto, Usuari usuari, Especie especie) {
        Mascota mascota = new Mascota();
        mascota.setNom(dto.getNomMascota());
        mascota.setDescripcio(dto.getDescripcio() != null && !dto.getDescripcio().isEmpty() ? dto.getDescripcio() : DESCRIPCIO_PER_DEFECTE);
        mascota.setEspecie(especie);
        mascota.setUsuari(usuari);
        mascota.setRaca(dto.getRaca() != null && !dto.getRaca().isEmpty() ? dto.getRaca() : RACA_PER_DEFECTE);
        mascota.setTeGeolocalitzacio(dto.getTeGeolocalitzacio() != null ? dto.getTeGeolocalitzacio() : false);
        mascota.setMicrochipId(dto.getMicrochipId());
        return mascota;
    }

    private Anunci construirAnunci(PostAnunciDTO dto, Mascota mascota, Estat estat) {
        Anunci anunci = new Anunci();
        anunci.setMascota(mascota);
        anunci.setEstat(estat);
        anunci.setLatitud(dto.getLatitud());
        anunci.setLongitud(dto.getLongitud());
        anunci.setData(LocalDateTime.now());
        anunci.setCiutat(dto.getCiutat());
        anunci.setProvincia(dto.getProvincia());
        return anunci;
    }

    private void guardarImatgeSiExisteix(String imatgeUrl, Mascota mascota) {
        if (imatgeUrl != null && !imatgeUrl.isEmpty()) {
            Imatge imatge = new Imatge();
            imatge.setUrl(imatgeUrl);
            imatge.setMascota(mascota);
            imatgeRepository.save(imatge);
        }
    }

    private Anunci verificarPropietatAnunci(Long anunciId, Long usuariId) {
        Anunci anunci = anunciRepository.findById(anunciId)
                .orElseThrow(() -> new BusinessException("Anunci no trobat"));

        if (!anunci.getMascota().getUsuari().getUsuariId().equals(usuariId)) {
            throw new BusinessException("No tens permis per modificar aquest anunci");
        }

        return anunci;
    }

    private void actualitzarDadesMascota(Mascota mascota, PostAnunciDTO dto) {
        mascota.setNom(dto.getNomMascota());
        mascota.setRaca(dto.getRaca() != null && !dto.getRaca().isEmpty() ? dto.getRaca() : RACA_PER_DEFECTE);
        mascota.setDescripcio(dto.getDescripcio() != null && !dto.getDescripcio().isEmpty() ? dto.getDescripcio() : DESCRIPCIO_PER_DEFECTE);

        if (dto.getEspecieId() != null) {
            Especie especie = obtenirEspeciePerId(dto.getEspecieId());
            mascota.setEspecie(especie);
        }
    }

    private void actualitzarImatgeMascota(Mascota mascota, PostAnunciDTO dto) {
        // 🔥 Cas 1: L'usuari vol eliminar la imatge
        if (dto.getEliminarImatge() != null && dto.getEliminarImatge()) {
            if (teImatges(mascota)) {
                for (Imatge imatge : mascota.getImatges()) {
                    try {
                        fileStorageService.deleteFile(imatge.getUrl());
                    } catch (Exception e) {
                        log.error("Error eliminant imatge: {}", imatge.getUrl(), e);
                    }
                }
                imatgeRepository.deleteAll(mascota.getImatges());
                mascota.getImatges().clear();
                log.info("Imatges eliminades per a mascota {}", mascota.getMascotaId());
            }
            return;
        }

        // 🔥 Cas 2: L'usuari ha pujat una imatge NOVA (url diferent de l'existent)
        boolean teImatgeNova = dto.getImatgeUrl() != null && !dto.getImatgeUrl().isEmpty();
        boolean teImatgeExistent = teImatges(mascota);
        String imatgeExistentUrl = teImatgeExistent ? mascota.getImatges().get(0).getUrl() : null;

        if (teImatgeNova && !dto.getImatgeUrl().equals(imatgeExistentUrl)) {
            // Eliminar imatges anteriors
            if (teImatgeExistent) {
                for (Imatge imatge : mascota.getImatges()) {
                    try {
                        fileStorageService.deleteFile(imatge.getUrl());
                    } catch (Exception e) {
                        log.error("Error eliminant imatge antiga: {}", imatge.getUrl(), e);
                    }
                }
                imatgeRepository.deleteAll(mascota.getImatges());
                mascota.getImatges().clear();
            }

            // Crear nova imatge
            Imatge novaImatge = new Imatge();
            novaImatge.setUrl(dto.getImatgeUrl());
            novaImatge.setMascota(mascota);
            imatgeRepository.save(novaImatge);

            if (mascota.getImatges() == null) {
                mascota.setImatges(new ArrayList<>());
            }
            mascota.getImatges().add(novaImatge);
            log.info("Imatge nova guardada per a mascota {}", mascota.getMascotaId());
        }

        // 🔥 Cas 3: No hi ha imatge nova i no s'ha demanat eliminar -> NO FER RES (conservar l'existent)
    }

    private void actualitzarDadesAnunci(Anunci anunci, PostAnunciDTO dto, Estat estat) {
        anunci.setEstat(estat);
        anunci.setLatitud(dto.getLatitud());
        anunci.setLongitud(dto.getLongitud());
        anunci.setCiutat(dto.getCiutat());
        anunci.setProvincia(dto.getProvincia());
    }

    private void eliminarImatgesDeMascota(Mascota mascota) {
        if (!teImatges(mascota)) {
            return;
        }

        mascota.getImatges().forEach(imatge -> {
            try {
                fileStorageService.deleteFile(imatge.getUrl());
            } catch (Exception e) {
                log.error("Error eliminant imatge: {}", imatge.getUrl(), e);
            }
        });

        imatgeRepository.deleteAll(mascota.getImatges());
        mascota.getImatges().clear();
    }

    private boolean teImatges(Mascota mascota) {
        return mascota.getImatges() != null && !mascota.getImatges().isEmpty();
    }

    private void eliminarMascotaSiNoTeAnuncis(Mascota mascota) {
        List<Anunci> anuncisMascota = anunciRepository.findByMascota_MascotaId(mascota.getMascotaId());
        if (anuncisMascota == null || anuncisMascota.isEmpty()) {
            mascotaRepository.delete(mascota);
            log.info("Mascota eliminada perquè no tenia anuncis: {}", mascota.getMascotaId());
        }
    }
}