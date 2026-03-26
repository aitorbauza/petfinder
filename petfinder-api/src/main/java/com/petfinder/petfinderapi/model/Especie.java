package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "especie")
@Data
@NoArgsConstructor
public class Especie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long especieId;

    @Column(length = 100)
    private String nom;

    @OneToMany(mappedBy = "especie")
    private List<Mascota> mascotas;
}