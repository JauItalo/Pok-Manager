package com.projetopokemanager.dto;

import jakarta.validation.constraints.NotNull;

public record AddToCollectionRequestDTO(
        @NotNull(message = "pokemonId é obrigatório")
        Long pokemonId
) {
}