package com.petfinder.petfinderapi.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConversaDTO {
    private Long conversaId;
    private String altreUsuariNom;
    private Long altreUsuariId;
    private String altreUsuariImatgeUrl;
    private String ultimMissatge;
    private LocalDateTime ultimMissatgeData;
    private Long anunciId;
    private String anunciNomMascota;
    private int missatgesNoLlegits;
}