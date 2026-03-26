package com.petfinder.petfinderapi.controller;

import com.petfinder.petfinderapi.dto.request.GetAnunciDTO;
import com.petfinder.petfinderapi.dto.request.PostAnunciDTO;
import com.petfinder.petfinderapi.service.AnunciService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            anunciService.crearAnunci(dto, usuariId); // Aquí ya se procesa la lógica
            return "OK";
        } catch (Exception e) {
            throw new Exception("Error al crear el anuncio: " + e.getMessage());
        }
    }

    @GetMapping("/obtenir")
    public List<GetAnunciDTO> obtenirAnuncis() {
        return anunciService.llistarAnuncis();
    }
}