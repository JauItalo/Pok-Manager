package com.projetopokemanager.integration.pokeapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PokeApiSpeciesDTO(
        Integer id,
        String name,
        @JsonProperty("evolves_from_species") PokeApiNamedResourceDTO evolvesFromSpecies
) {
}