package com.petfinder.petfinderapi.dto.request;

import lombok.Data;

@Data
public class EnviarMissatgeDTO {
    private Long conversaId;
    private Long anunciId;
    private Long destinatariId;
    private String contingut;
    private Long usuariId;
}