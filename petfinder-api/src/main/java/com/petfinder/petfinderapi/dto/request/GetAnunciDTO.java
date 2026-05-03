package com.petfinder.petfinderapi.dto.request;

import com.petfinder.petfinderapi.dto.UbicacioTempsRealDTO;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GetAnunciDTO {
    private Long id;
    private Double latitud;
    private Double longitud;
    private LocalDateTime data;
    private String estat;
    private String nomMascota;
    private String especie;
    private Long especieId;
    private String raca;
    private String descripcio;
    private String imatgeUrl;
    private String ciutat;
    private String provincia;
    private Long usuariId;
    private String usuariNom;
    private String usuariTelefon;
    private Boolean teGeolocalitzacio;
    private String microchipId;
    private UbicacioTempsRealDTO ultimaUbicacio;
    private Long mascotaId;
}