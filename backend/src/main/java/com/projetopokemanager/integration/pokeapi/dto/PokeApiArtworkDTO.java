package com.projetopokemanager.integration.pokeapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PokeApiArtworkDTO(
        @JsonProperty("front_default") String frontDefault
) {
}