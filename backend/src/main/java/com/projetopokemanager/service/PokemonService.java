package com.projetopokemanager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.AbilityDTO;
import com.projetopokemanager.dto.PokemonEffectivenessResponseDTO;
import com.projetopokemanager.dto.PokemonResponseDTO;
import com.projetopokemanager.entity.Pokemon;
import com.projetopokemanager.entity.enums.PokemonType;
import com.projetopokemanager.exception.ResourceNotFoundException;
import com.projetopokemanager.repository.PokemonRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PokemonService {

    private final PokemonRepository pokemonRepository;

    public List<PokemonResponseDTO> findAll() {
        return pokemonRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private PokemonResponseDTO toDTO(Pokemon pokemon) {
    List<AbilityDTO> abilities = pokemon.getAbilities().stream()
            .map(pa -> new AbilityDTO(pa.getAbility().getName(), pa.isHidden()))
            .toList();

    return new PokemonResponseDTO(
            pokemon.getId(),
            pokemon.getPokeapiId(),
            pokemon.getName(),
            pokemon.getPrimaryType(),
            pokemon.getSecondaryType(),
            pokemon.getHp(),
            pokemon.getAttack(),
            pokemon.getDefense(),
            pokemon.getSpecialAttack(),
            pokemon.getSpecialDefense(),
            pokemon.getSpeed(),
            pokemon.getImageUrl(),
            abilities
    );
}

    public List<PokemonResponseDTO> search(String name, PokemonType type) {
        return pokemonRepository.search(name, type)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public PokemonResponseDTO findById(Long id) {
        Pokemon pokemon = pokemonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                "Pokémon não encontrado com id: " + id));

        return toDTO(pokemon);
    }

    private final TypeEffectivenessService typeEffectivenessService;

    public PokemonEffectivenessResponseDTO getEffectiveness(Long id) {
        Pokemon pokemon = pokemonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                "Pokémon não encontrado com id: " + id));

        return typeEffectivenessService.calculate(pokemon.getPrimaryType(), pokemon.getSecondaryType());
    }

    
}
