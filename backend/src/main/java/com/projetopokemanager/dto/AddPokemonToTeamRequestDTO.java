package com.projetopokemanager.dto;

import jakarta.validation.constraints.NotNull;

public record AddPokemonToTeamRequestDTO(
        @NotNull(message = "pokemonId é obrigatório")
        Long pokemonId
) {
}