package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "usuari")
@Data
@NoArgsConstructor
public class Usuari {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usuariId;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 500)
    private String password;

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @Column(length = 50, unique = true)
    private String telefon;

    @Column(length = 50)
    private String rol;

    @Column(length = 100)
    private String imatgeUrl;

    @OneToMany(mappedBy = "usuari", cascade = CascadeType.ALL)
    private List<Mascota> mascotas;

    @ManyToMany(mappedBy = "usuaris")
    private Set<Conversa> converses;
}