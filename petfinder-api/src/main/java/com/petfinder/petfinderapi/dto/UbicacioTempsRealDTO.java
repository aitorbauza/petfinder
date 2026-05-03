package com.petfinder.petfinderapi.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UbicacioTempsRealDTO {
    private Long id;
    private Long mascotaId;
    private Double latitud;
    private Double longitud;
    private LocalDateTime timestamp;
    private Boolean actiu;
}