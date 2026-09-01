package com.projetopokemanager.integration.pokeapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PokeApiAbilitySlotDTO(
        PokeApiNamedResourceDTO ability,
        @JsonProperty("is_hidden") Boolean isHidden,
        Integer slot
) {
}