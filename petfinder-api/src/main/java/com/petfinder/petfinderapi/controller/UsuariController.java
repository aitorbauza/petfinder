package com.petfinder.petfinderapi.controller;

import com.petfinder.petfinderapi.dto.request.PostUsuariDTO;
import com.petfinder.petfinderapi.model.Usuari;
import com.petfinder.petfinderapi.service.FileStorageService;
import com.petfinder.petfinderapi.service.UsuariService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/usuaris")
public class UsuariController {

    private final UsuariService usuariService;

    @Autowired
    private FileStorageService fileStorageService;

    public UsuariController(UsuariService usuariService) {
        this.usuariService = usuariService;
    }

    @PostMapping("/crear")
    public Usuari registrar(@RequestBody PostUsuariDTO dto) throws Exception {
        return usuariService.crearUsuari(dto);
    }

    @PostMapping("/login")
    public Usuari login(@RequestBody PostUsuariDTO dto) throws Exception {
        return usuariService.login(dto.getEmail(), dto.getPassword());
    }

    @PostMapping("/pujar-perfil")
    public ResponseEntity<?> pujarImatgePerfil(@RequestParam("fitxer") MultipartFile fitxer, @RequestParam("usuariId") Long usuariId) {
        try {
            String url = fileStorageService.storePerfilImage(fitxer);

            // Actualitzar l'usuari amb la nova URL
            Usuari usuari = usuariService.actualitzarImatgePerfil(usuariId, url);

            return ResponseEntity.ok(Map.of(
                    "url", url,
                    "usuari", usuari
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error pujant imatge de perfil: " + e.getMessage()));
        }
    }
}