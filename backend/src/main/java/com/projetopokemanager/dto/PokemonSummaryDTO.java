package com.projetopokemanager.dto;

import com.projetopokemanager.entity.enums.PokemonType;

public record PokemonSummaryDTO(
        Long id,
        Integer pokeapiId,
        String name,
        String imageUrl,
        PokemonType primaryType,
        PokemonType secondaryType
) {
}