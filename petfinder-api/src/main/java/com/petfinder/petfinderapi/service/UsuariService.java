package com.petfinder.petfinderapi.service;

import com.petfinder.petfinderapi.dto.request.PostUsuariDTO;
import com.petfinder.petfinderapi.model.Usuari;
import com.petfinder.petfinderapi.repository.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuariService {

    private final UsuariRepository usuariRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuariService(UsuariRepository usuariRepository) {
        this.usuariRepository = usuariRepository;
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

        return usuari; // Devuelves el usuariId al front
    }
}
