package com.projetopokemanager.integration.pokeapi;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.projetopokemanager.integration.pokeapi.dto.PokeApiPokemonDTO;
import com.projetopokemanager.integration.pokeapi.dto.PokeApiSpeciesDTO;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PokeApiClient {

    private final RestClient pokeApiRestClient;

    public PokeApiPokemonDTO fetchPokemon(int pokeapiId) {
        return pokeApiRestClient.get()
                .uri("/pokemon/{id}", pokeapiId)
                .retrieve()
                .body(PokeApiPokemonDTO.class);
    }

    public PokeApiSpeciesDTO fetchSpecies(int pokeapiId) {
    return pokeApiRestClient.get()
            .uri("/pokemon-species/{id}", pokeapiId)
            .retrieve()
            .body(PokeApiSpeciesDTO.class);
}
}
