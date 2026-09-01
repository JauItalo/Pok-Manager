package com.projetopokemanager.integration.pokeapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PokeApiStatSlotDTO(
        @JsonProperty("base_stat") Integer baseStat,
        PokeApiNamedResourceDTO stat
) {
}