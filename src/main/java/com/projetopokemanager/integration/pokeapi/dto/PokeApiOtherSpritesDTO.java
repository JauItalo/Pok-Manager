package com.projetopokemanager.integration.pokeapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PokeApiOtherSpritesDTO(
        @JsonProperty("official-artwork") PokeApiArtworkDTO officialArtwork
) {
}