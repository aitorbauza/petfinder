package com.petfinder.petfinderapi.utils;

public enum EspecieMascotaEnum {
    GOS(1),    // perro
    GAT(2),    // gato
    CONILL(3); // conejo

    private final int id;

    EspecieMascotaEnum(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    // Para buscar enum por id
    public static EspecieMascotaEnum fromId(int id) {
        for (EspecieMascotaEnum e : values()) {
            if (e.id == id) return e;
        }
        throw new IllegalArgumentException("ID de especie inválido: " + id);
    }
}