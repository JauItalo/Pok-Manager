package com.projetopokemanager.dto;

public record TeamMemberResponseDTO(
        Long entryId,
        PokemonSummaryDTO pokemon
) {
}