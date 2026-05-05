package com.petfinder.petfinderapi.controller;

import com.petfinder.petfinderapi.dto.request.PostAnunciDTO;
import com.petfinder.petfinderapi.dto.UsuariAdminDTO;
import com.petfinder.petfinderapi.dto.AnunciAdminDTO;
import com.petfinder.petfinderapi.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/anuncis")
    public ResponseEntity<List<AnunciAdminDTO>> obtenirTotsElsAnuncis() {
        return ResponseEntity.ok(adminService.obtenirTotsElsAnuncis());
    }

    @DeleteMapping("/anuncis/{anunciId}")
    public ResponseEntity<?> eliminarAnunci(@PathVariable Long anunciId) {
        try {
            adminService.eliminarAnunci(anunciId);
            return ResponseEntity.ok().body(Map.of("message", "Anunci eliminat correctament"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/anuncis/{anunciId}")
    public ResponseEntity<?> editarAnunciAdmin(
            @PathVariable Long anunciId,
            @RequestBody PostAnunciDTO dto) {
        try {
            adminService.editarAnunciAdmin(anunciId, dto);
            return ResponseEntity.ok().body(Map.of("message", "Anunci actualitzat correctament"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/usuaris")
    public ResponseEntity<List<UsuariAdminDTO>> obtenirTotsElsUsuaris() {
        return ResponseEntity.ok(adminService.obtenirTotsElsUsuaris());
    }

    @DeleteMapping("/usuaris/{usuariId}")
    public ResponseEntity<?> eliminarUsuari(@PathVariable Long usuariId) {
        try {
            adminService.eliminarUsuari(usuariId);
            return ResponseEntity.ok().body(Map.of("message", "Usuari eliminat correctament"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/usuaris/{usuariId}")
    public ResponseEntity<?> editarUsuariAdmin(
            @PathVariable Long usuariId,
            @RequestBody Map<String, String> data) {
        try {
            adminService.editarUsuari(usuariId, data);
            return ResponseEntity.ok().body(Map.of("message", "Usuari actualitzat correctament"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}