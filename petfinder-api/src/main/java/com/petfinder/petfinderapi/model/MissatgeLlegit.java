package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "missatge_llegit")
@Data
@NoArgsConstructor
public class MissatgeLlegit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "missatge_id")
    private Missatge missatge;

    @ManyToOne
    @JoinColumn(name = "usuari_id")
    private Usuari usuari;

    private Boolean llegit = false;

    private LocalDateTime dataLlegit;
}