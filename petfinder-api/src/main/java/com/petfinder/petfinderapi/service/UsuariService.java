package com.petfinder.petfinderapi.service;

import com.petfinder.petfinderapi.dto.request.PostUsuariDTO;
import com.petfinder.petfinderapi.exception.BusinessException;
import com.petfinder.petfinderapi.model.Usuari;
import com.petfinder.petfinderapi.repository.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuariService {

    private final UsuariRepository usuariRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public UsuariService(UsuariRepository usuariRepository, FileStorageService fileStorageService) {
        this.usuariRepository = usuariRepository;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder =  new BCryptPasswordEncoder();
    }

    public Usuari crearUsuari(PostUsuariDTO dto) throws Exception {
        if (usuariRepository.existsByEmail(dto.getEmail())) {
            throw new Exception("Email ja registrat");
        }

        Usuari usuari = new Usuari();
        usuari.setNom(dto.getNom());
        usuari.setEmail(dto.getEmail());
        usuari.setTelefon(dto.getTelefon());
        usuari.setRol("USER"); // valor por defecto
        usuari.setImatgeUrl(dto.getImatgeUrl());
        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        usuari.setPassword(hashedPassword);
        return usuariRepository.save(usuari);
    }

    public Usuari login(String email, String password) throws Exception {
        Usuari usuari = usuariRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Usuari no trobat"));
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

//  Descomentar esto para poder obtener psswd hasheado y meterla en bbdd para todos aquellos users creados antes del hasheo de contraseñas
//        String hashedPassword = encoder.encode("Aitor1234");
//        System.out.println(hashedPassword);

        if (!passwordEncoder.matches(password, usuari.getPassword())) {
            throw new Exception("Credenciales incorrectas");
        }

        return usuari;
    }

    public Usuari actualitzarImatgePerfil(Long usuariId, String imatgeUrl) throws Exception {
        Usuari usuari = usuariRepository.findById(usuariId)
                .orElseThrow(() -> new Exception("Usuari no trobat"));
        usuari.setImatgeUrl(imatgeUrl);
        return usuariRepository.save(usuari);
    }

    @Transactional
    public Usuari eliminarImatgePerfil(Long usuariId) throws Exception {
        Usuari usuari = usuariRepository.findById(usuariId)
                .orElseThrow(() -> new Exception("Usuari no trobat"));

        // Eliminar el fitxer físic si existeix
        if (usuari.getImatgeUrl() != null && !usuari.getImatgeUrl().isEmpty()) {
            try {
                fileStorageService.deleteFile(usuari.getImatgeUrl());
            } catch (Exception e) {
                System.err.println("Error eliminant fitxer: " + e.getMessage());
            }
        }

        // Posar la URL a null a la BD
        usuari.setImatgeUrl(null);
        return usuariRepository.save(usuari);
    }

    public Usuari actualitzarUsuari(Long usuariId, String nom, String telefon) throws Exception {
        Usuari usuari = usuariRepository.findById(usuariId)
                .orElseThrow(() -> new Exception("Usuari no trobat"));

        if (telefon != null && !telefon.isEmpty()) {
            // Validar que el telèfon no estigui en ús per un altre usuari
            java.util.Optional<Usuari> existingUser = usuariRepository.findByTelefon(telefon);
            if (existingUser.isPresent() && !existingUser.get().getUsuariId().equals(usuariId)) {
                throw new Exception("El telèfon ja està registrat per un altre usuari");
            }
            usuari.setTelefon(telefon);
        }

        if (nom != null && !nom.isEmpty()) {
            usuari.setNom(nom);
        }

        return usuariRepository.save(usuari);
    }

    public Usuari obtenirUsuariPerId(Long usuariId) {
        return usuariRepository.findById(usuariId)
                .orElseThrow(() -> new BusinessException("Usuari no trobat"));
    }

}