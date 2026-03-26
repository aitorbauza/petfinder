package com.petfinder.petfinderapi.controller;

import com.petfinder.petfinderapi.dto.request.PostUsuariDTO;
import com.petfinder.petfinderapi.model.Usuari;
import com.petfinder.petfinderapi.service.UsuariService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/usuaris")
public class UsuariController {

    private final UsuariService usuariService;

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
}