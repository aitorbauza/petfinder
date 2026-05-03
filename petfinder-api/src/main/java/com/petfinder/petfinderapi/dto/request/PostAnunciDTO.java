package com.petfinder.petfinderapi.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostAnunciDTO {

    private Long mascotaId;
    private String nomMascota;
    private Long especieId;
    private String raca;
    private String descripcio;
    private Long estatId;         // Perdida/Trobada
    private Double latitud;
    private Double longitud;
    private String imatgeUrl;
    private String ciutat;
    private String provincia;
    private Boolean teGeolocalitzacio;
    private String microchipId;
}