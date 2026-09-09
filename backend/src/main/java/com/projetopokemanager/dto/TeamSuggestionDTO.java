package com.projetopokemanager.dto;

import java.util.List;

import com.projetopokemanager.entity.enums.PokemonType;

public record TeamSuggestionDTO(
        PokemonType weakAgainstType,
        int weaknessPercentage,
        List<PokemonType> recommendedTypes
) {
}