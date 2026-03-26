package com.petfinder.petfinderapi.dto.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GetAnunciDTO {
    private Long id;
    private String estat;
    private String raca;
    private String nomMascota;
    private String especie;
    private Double latitud;
    private Double longitud;
    private LocalDateTime data;
}