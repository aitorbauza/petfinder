package com.petfinder.petfinderapi.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostAnunciDTO {

    private Long mascotaId;       // Puede ser null si es nueva
    private String nomMascota;    // Nombre de la mascota (si es nueva)
    private Long especieId;       // Ej: "Gos", "Gat"
    private String raca;          // Raza de la mascota
    private String descripcio;    // Descripción
    private Long estatId;         // Perdida/Trobada
    private Double latitud;
    private Double longitud;
}