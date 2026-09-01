package com.projetopokemanager.dto;

import com.projetopokemanager.entity.enums.PokemonType;

public record PokemonResponseDTO(
        Long id,
        Integer pokeapiId,
        String name,
        PokemonType primaryType,
        PokemonType secondaryType,
        Integer hp,
        Integer attack,
        Integer defense,
        Integer specialAttack,
        Integer specialDefense,
        Integer speed,
        String imageUrl
) {
}