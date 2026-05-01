package com.petfinder.petfinderapi.controller;

import com.petfinder.petfinderapi.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/imatges")
public class ImatgeController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/pujar", consumes = "multipart/form-data")
    public ResponseEntity<?> pujarImatge(@RequestParam("fitxer") MultipartFile fitxer) {
        try {
            if (fitxer.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El fitxer està buit"));
            }

            String url = fileStorageService.storeFile(fitxer);

            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error pujant imatge: " + e.getMessage()));
        }
    }
}