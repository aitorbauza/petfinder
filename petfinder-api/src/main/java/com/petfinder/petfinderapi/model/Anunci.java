package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "anunci")
@Getter
@Setter
@NoArgsConstructor
public class Anunci {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long anunciId;

    private LocalDateTime data;

    @Column
    private Double latitud;

    @Column
    private Double longitud;

    @ManyToOne
    @JoinColumn(name = "id_estat")
    private Estat estat;

    @ManyToOne
    @JoinColumn(name = "id_mascota")
    private Mascota mascota;
}