package com.petfinder.petfinderapi.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnunciDTO {

    private Long id;
    private String estat;
    private Double latitud;
    private Double longitud;
    private String nomMascota;
    private String especie;
    private LocalDateTime data;
}