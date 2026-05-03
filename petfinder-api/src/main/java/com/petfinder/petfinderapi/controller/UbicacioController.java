package com.petfinder.petfinderapi.controller;

import com.petfinder.petfinderapi.dto.UbicacioTempsRealDTO;
import com.petfinder.petfinderapi.service.GeolocalitzacioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/ubicacions")
public class UbicacioController {

    private final GeolocalitzacioService geolocalitzacioService;

    public UbicacioController(GeolocalitzacioService geolocalitzacioService) {
        this.geolocalitzacioService = geolocalitzacioService;
    }

    @GetMapping("/ultima/{mascotaId}")
    public ResponseEntity<UbicacioTempsRealDTO> obtenirUltimaUbicacio(@PathVariable Long mascotaId) {
        UbicacioTempsRealDTO ubicacio = geolocalitzacioService.obtenirUltimaUbicacio(mascotaId);
        return ResponseEntity.ok(ubicacio);
    }

    @GetMapping("/actives")
    public ResponseEntity<List<UbicacioTempsRealDTO>> obtenirTotesUbicacionsActives() {
        return ResponseEntity.ok(geolocalitzacioService.obtenirTotesUbicacionsActives());
    }

    @PostMapping("/simular/{mascotaId}")
    public ResponseEntity<UbicacioTempsRealDTO> simularMoviment(@PathVariable Long mascotaId) {
        UbicacioTempsRealDTO novaUbicacio = geolocalitzacioService.generarMovimentAleatori(mascotaId);
        return ResponseEntity.ok(novaUbicacio);
    }

    @PostMapping("/inicialitzar")
    public ResponseEntity<?> inicialitzarUbicacio(
            @RequestParam Long mascotaId,
            @RequestParam Double latitud,
            @RequestParam Double longitud) {
        try {
            geolocalitzacioService.guardarUbicacio(mascotaId, latitud, longitud);
            return ResponseEntity.ok().body("Ubicació inicial guardada correctament");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error guardant ubicació inicial: " + e.getMessage());
        }
    }
}