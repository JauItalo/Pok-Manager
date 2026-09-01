package com.projetopokemanager.dto;

import com.projetopokemanager.entity.enums.PokemonType;

public record TypeEffectivenessDTO(
        PokemonType type,
        double multiplier
) {
}