package com.projetopokemanager.dto;

import com.projetopokemanager.entity.enums.PokemonType;

public record TeamTypeScoreDTO(
        PokemonType type,
        int percentage
) {
}