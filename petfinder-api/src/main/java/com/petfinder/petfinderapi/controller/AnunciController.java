package com.petfinder.petfinderapi.controller;

import com.petfinder.petfinderapi.dto.request.GetAnunciDTO;
import com.petfinder.petfinderapi.dto.request.PostAnunciDTO;
import com.petfinder.petfinderapi.service.AnunciService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/anuncis")
@CrossOrigin // Cors per poder fer peticions des del frontend sense cap problema de seguretat
public class AnunciController {

    private final AnunciService anunciService;

    public AnunciController(AnunciService anunciService) {
        this.anunciService = anunciService;
    }

    @PostMapping("/crear")
    public String crearAnunci(@RequestBody PostAnunciDTO dto, @RequestParam Long usuariId) throws Exception {
        try {
            anunciService.crearAnunci(dto, usuariId);
            return "OK";
        } catch (Exception e) {
            throw new Exception("Error al crear el anuncio: " + e.getMessage());
        }
    }

    @GetMapping("/obtenir")
    public List<GetAnunciDTO> obtenirAnuncis() {
        return anunciService.llistarAnuncis();
    }

    @GetMapping("/meus")
    public ResponseEntity<?> obtenirAnuncisPropis(@RequestParam Long usuariId) {
        try {
            List<GetAnunciDTO> anuncis = anunciService.llistarAnuncisPerUsuari(usuariId);
            return ResponseEntity.ok(anuncis);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{anunciId}")
    public ResponseEntity<?> obtenirAnunciPerId(@PathVariable Long anunciId) {
        try {
            GetAnunciDTO anunci = anunciService.obtenirAnunciPerId(anunciId);
            System.out.println("📢 Enviant anunci al frontend: " + anunci);
            System.out.println("👤 usuariId: " + anunci.getUsuariId());
            return ResponseEntity.ok(anunci);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{anunciId}")
    public ResponseEntity<?> actualitzarAnunci(
            @PathVariable Long anunciId,
            @RequestBody PostAnunciDTO dto,
            @RequestParam Long usuariId) {
        try {
            anunciService.actualitzarAnunci(anunciId, dto, usuariId);
            return ResponseEntity.ok(Map.of("message", "Anunci actualitzat correctament"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{anunciId}")
    public ResponseEntity<?> eliminarAnunci(
            @PathVariable Long anunciId,
            @RequestParam Long usuariId) {
        try {
            anunciService.eliminarAnunci(anunciId, usuariId);
            return ResponseEntity.ok(Map.of("message", "Anunci eliminat correctament"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}