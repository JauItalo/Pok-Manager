package com.projetopokemanager.integration.pokeapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PokeApiNamedResourceDTO(
        String name
) {
}