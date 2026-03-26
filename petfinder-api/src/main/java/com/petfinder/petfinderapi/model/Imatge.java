package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "imatge")
@Data
@NoArgsConstructor
public class Imatge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String url;

    @ManyToOne
    @JoinColumn(name = "id_mascota")
    private Mascota mascota;
}