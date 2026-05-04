package com.petfinder.petfinderapi.dto;

import lombok.Data;

@Data
public class UsuariAdminDTO {
    private Long usuariId;
    private String nom;
    private String email;
    private String telefon;
    private String rol;
    private String imatgeUrl;
}