package com.petfinder.petfinderapi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir:uploads/}")
    private String uploadDir;

    @Value("${app.upload.mascotes:uploads/mascotes/}")
    private String mascotesDir;

    @Value("${app.upload.perfils:uploads/perfils/}")
    private String perfilsDir;

    public String storeMascotaImage(MultipartFile file) throws IOException {
        return storeFile(file, mascotesDir, "mascotes/");
    }

    public String storePerfilImage(MultipartFile file) throws IOException {
        return storeFile(file, perfilsDir, "perfils/");
    }

    private String storeFile(MultipartFile file, String directory, String urlPrefix) throws IOException {
        // Crear directori si no existeix
        Path uploadPath = Paths.get(directory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Obtenir extensió del fitxer
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        // Generar nom únic
        String fileName = UUID.randomUUID() + extension;

        // Guardar fitxer
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        // Retornar URL relativa
        return "/uploads/" + urlPrefix + fileName;
    }

    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        // Extreure el nom del fitxer de la URL
        // Exemple: /uploads/perfils/abc123.jpg -> perfils/abc123.jpg
        String relativePath = fileUrl.replace("/uploads/", "");

        // Determinar quin directori utilitzar
        Path filePath;
        if (relativePath.startsWith("mascotes/")) {
            filePath = Paths.get(mascotesDir, relativePath.replace("mascotes/", ""));
        } else if (relativePath.startsWith("perfils/")) {
            filePath = Paths.get(perfilsDir, relativePath.replace("perfils/", ""));
        } else {
            // Fallback per a compatibilitat
            filePath = Paths.get("uploads", relativePath);
        }

        // Eliminar el fitxer si existeix
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            System.out.println("✅ Fitxer eliminat: " + filePath.toAbsolutePath());
        }
    }
}