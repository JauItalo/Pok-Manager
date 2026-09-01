package com.projetopokemanager.integration.pokeapi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PokeApiPokemonDTO(
        Integer id,
        String name,
        Integer height,
        Integer weight,
        List<PokeApiTypeSlotDTO> types,
        List<PokeApiStatSlotDTO> stats,
        List<PokeApiAbilitySlotDTO> abilities,
        PokeApiSpritesDTO sprites
) {
}