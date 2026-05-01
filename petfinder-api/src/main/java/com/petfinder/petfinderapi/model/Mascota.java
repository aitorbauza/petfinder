package com.petfinder.petfinderapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String nom;

    @Column(length = 100)
    private String raca;

    @Column(length = 200)
    private String descripcio;

    @ManyToOne
    @JoinColumn(name = "id_usuari")
    @JsonIgnore
    private Usuari usuari;

    @ManyToOne
    @JoinColumn(name = "id_especie")
    private Especie especie;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Imatge> imatges;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Anunci> anuncis;
}