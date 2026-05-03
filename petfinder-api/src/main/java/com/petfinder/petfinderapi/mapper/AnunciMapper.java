package com.petfinder.petfinderapi.mapper;

import com.petfinder.petfinderapi.dto.AnunciDTO;
import com.petfinder.petfinderapi.dto.request.GetAnunciDTO;
import com.petfinder.petfinderapi.model.Anunci;

public class AnunciMapper {

    public static AnunciDTO toDTO(Anunci anunci) {
        AnunciDTO dto = new AnunciDTO();

        dto.setId(anunci.getAnunciId());
        dto.setLatitud(anunci.getLatitud());
        dto.setLongitud(anunci.getLongitud());
        dto.setData(anunci.getData());

        dto.setEstat(anunci.getEstat().getNom());
        dto.setNomMascota(anunci.getMascota().getNom());
        dto.setEspecie(anunci.getMascota().getEspecie().getNom());

        return dto;
    }

    public static GetAnunciDTO toGetDTO(Anunci anunci) {
        GetAnunciDTO dto = new GetAnunciDTO();
        dto.setId(anunci.getAnunciId());
        dto.setLatitud(anunci.getLatitud());
        dto.setLongitud(anunci.getLongitud());
        dto.setData(anunci.getData());
        dto.setEstat(anunci.getEstat().getNom());
        dto.setRaca(anunci.getMascota().getRaca());
        dto.setNomMascota(anunci.getMascota().getNom());
        dto.setEspecie(anunci.getMascota().getEspecie().getNom());
        dto.setEspecieId(anunci.getMascota().getEspecie().getEspecieId());
        dto.setCiutat(anunci.getCiutat());
        dto.setProvincia(anunci.getProvincia());
        dto.setDescripcio(anunci.getMascota().getDescripcio());
        dto.setUsuariId(anunci.getMascota().getUsuari().getUsuariId());
        dto.setUsuariNom(anunci.getMascota().getUsuari().getNom());
        dto.setUsuariTelefon(anunci.getMascota().getUsuari().getTelefon());
        dto.setTeGeolocalitzacio(anunci.getMascota().getTeGeolocalitzacio());
        dto.setMicrochipId(anunci.getMascota().getMicrochipId());
        dto.setMascotaId(anunci.getMascota().getMascotaId());

        if (anunci.getMascota().getImatges() != null && !anunci.getMascota().getImatges().isEmpty()) {
            dto.setImatgeUrl(anunci.getMascota().getImatges().get(0).getUrl());
        } // Si la imatge es null, en el front s'afegirà una imatge per defecte

        return dto;
    }
}