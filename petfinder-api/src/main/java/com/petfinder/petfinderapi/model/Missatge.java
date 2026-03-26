package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "missatge")
@Data
@NoArgsConstructor
public class Missatge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 500)
    private String contingut;

    private LocalDateTime data;

    @ManyToOne
    @JoinColumn(name = "id_conversa")
    private Conversa conversa;

    @ManyToOne
    @JoinColumn(name = "id_usuari")
    private Usuari usuari;
}