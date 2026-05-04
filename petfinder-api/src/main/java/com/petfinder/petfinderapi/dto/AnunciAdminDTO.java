package com.petfinder.petfinderapi.dto;

import lombok.Data;

@Data
public class AnunciAdminDTO {
    private Long id;
    private Long mascotaId;
    private String nomMascota;
    private String especie;
    private String raca;
    private String descripcio;
    private String estat;
    private Double latitud;
    private Double longitud;
    private String ciutat;
    private String provincia;
    private String data;
    private Long usuariId;
    private String usuariNom;
    private String imatgeUrl;
}