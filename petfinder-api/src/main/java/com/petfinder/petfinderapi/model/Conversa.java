package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversa")
@Data
@NoArgsConstructor
public class Conversa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversaId;

    @ManyToMany
    @JoinTable(
            name = "usuari_conversa",
            joinColumns = @JoinColumn(name = "id_conversa"),
            inverseJoinColumns = @JoinColumn(name = "id_usuari")
    )
    private List<Usuari> usuaris = new ArrayList<>();

    @OneToMany(mappedBy = "conversa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Missatge> missatges = new ArrayList<>();
}