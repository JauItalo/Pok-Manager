package com.projetopokemanager.dto;

import java.util.List;

public record PokemonEvolutionResponseDTO(
        PokemonSummaryDTO current,
        PokemonSummaryDTO evolvesFrom,
        List<PokemonSummaryDTO> evolvesTo
) {
}