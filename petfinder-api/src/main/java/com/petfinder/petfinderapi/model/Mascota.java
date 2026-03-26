package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "mascota")
@Data
@NoArgsConstructor
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mascotaId;

    @Column(length = 100)
    private String nom; // raça

    @Column(length = 100)
    private String raca; // raça

    @Column(length = 200)
    private String descripcio;

    @ManyToOne
    @JoinColumn(name = "id_usuari")
    private Usuari usuari;

    @ManyToOne
    @JoinColumn(name = "id_especie")
    private Especie especie;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL)
    private List<Imatge> imatges;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL)
    private List<Anunci> anuncis;
}