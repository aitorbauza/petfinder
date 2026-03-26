package com.petfinder.petfinderapi.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostUsuariDTO {
    private String nom;
    private String email;
    private String telefon;
    private String password; // para beta simple
}