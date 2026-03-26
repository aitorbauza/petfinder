package com.petfinder.petfinderapi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "estat")
@Data
@NoArgsConstructor
public class Estat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long estatId;

    @Column(length = 20)
    private String nom;

    @OneToMany(mappedBy = "estat")
    private List<Anunci> anuncis;
}