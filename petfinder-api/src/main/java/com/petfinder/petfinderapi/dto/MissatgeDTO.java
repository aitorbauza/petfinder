package com.petfinder.petfinderapi.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MissatgeDTO {
    private Long id;
    private String contingut;
    private LocalDateTime data;
    private Long usuariId;
    private String usuariNom;
    private Boolean esMeu;
    private Boolean llegit;
}