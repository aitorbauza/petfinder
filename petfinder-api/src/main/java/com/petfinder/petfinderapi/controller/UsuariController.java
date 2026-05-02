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

    @PutMapping("/{usuariId}")
    public ResponseEntity<?> actualitzarUsuari(
            @PathVariable Long usuariId,
            @RequestBody Map<String, String> updates) {
        try {
            String nom = updates.get("nom");
            String telefon = updates.get("telefon");

            Usuari usuari = usuariService.actualitzarUsuari(usuariId, nom, telefon);
            return ResponseEntity.ok(usuari);
        } catch (Exception e) {
            if (e.getMessage().contains("El telèfon ja està registrat")) {
                return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{usuariId}/imatge-perfil")
    public ResponseEntity<?> eliminarImatgePerfil(@PathVariable Long usuariId) {
        try {
            Usuari usuari = usuariService.eliminarImatgePerfil(usuariId);
            return ResponseEntity.ok(Map.of(
                    "message", "Imatge eliminada correctament",
                    "usuari", usuari
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error eliminant la imatge: " + e.getMessage()));
        }
    }
}