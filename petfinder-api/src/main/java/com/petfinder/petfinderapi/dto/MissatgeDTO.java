package com.petfinder.petfinderapi.dto;

import lombok.Data;

@Data
public class MissatgeDTO {

    private Long id;
    private String contingut;
    private Long usuariId;
    private Long conversaId;
}