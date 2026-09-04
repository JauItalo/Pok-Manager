package com.projetopokemanager.dto;

import java.time.LocalDateTime;

import com.projetopokemanager.entity.enums.Nature;

public record CollectionEntryResponseDTO(
        Long id,
        PokemonSummaryDTO pokemon,
        boolean captured,
        Integer level,
        Nature nature,
        String ability,
        String nickname,
        boolean favorite,
        String obtainedMethod,
        LocalDateTime createdAt
) {
}