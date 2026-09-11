package com.projetopokemanager.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.SyncResultDTO;
import com.projetopokemanager.entity.Ability;
import com.projetopokemanager.entity.Pokemon;
import com.projetopokemanager.entity.PokemonAbility;
import com.projetopokemanager.entity.enums.PokemonType;
import com.projetopokemanager.integration.pokeapi.PokeApiClient;
import com.projetopokemanager.integration.pokeapi.dto.PokeApiAbilitySlotDTO;
import com.projetopokemanager.integration.pokeapi.dto.PokeApiPokemonDTO;
import com.projetopokemanager.integration.pokeapi.dto.PokeApiSpeciesDTO;
import com.projetopokemanager.integration.pokeapi.dto.PokeApiStatSlotDTO;
import com.projetopokemanager.repository.AbilityRepository;
import com.projetopokemanager.repository.PokemonRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PokemonSyncService {

    private final PokeApiClient pokeApiClient;
    private final PokemonRepository pokemonRepository;
    private final AbilityRepository abilityRepository;

    public SyncResultDTO syncRange(int startId, int endId) {
        int synced = 0;
        int skipped = 0;
        List<Integer> failed = new ArrayList<>();

        for (int id = startId; id <= endId; id++) {
            try {
                boolean wasSynced = syncOne(id);
                if (wasSynced) {
                    synced++;
                } else {
                    skipped++;
                }
            } catch (Exception e) {
                log.warn("Falha ao sincronizar Pokémon {}: {}", id, e.getMessage());
                failed.add(id);
            }
        }

        return new SyncResultDTO(endId - startId + 1, synced, skipped, failed);
    }

    private boolean syncOne(int pokeapiId) {
        if (pokemonRepository.existsByPokeapiId(pokeapiId)) {
            return false;
        }

        PokeApiPokemonDTO dto = pokeApiClient.fetchPokemon(pokeapiId);
        Pokemon pokemon = toEntity(dto);
        attachAbilities(pokemon, dto.abilities());

        pokemonRepository.save(pokemon);

        attachSpeciesData(pokemon, pokeapiId);

        log.info("Pokémon {} ({}) sincronizado.", pokeapiId, pokemon.getName());
        return true;
    }

    private void attachAbilities(Pokemon pokemon, List<PokeApiAbilitySlotDTO> abilitySlots) {
        for (PokeApiAbilitySlotDTO slot : abilitySlots) {
            Ability ability = findOrCreateAbility(slot.ability().name());

            PokemonAbility pokemonAbility = PokemonAbility.builder()
                    .pokemon(pokemon)
                    .ability(ability)
                    .hidden(Boolean.TRUE.equals(slot.isHidden()))
                    .slot(slot.slot())
                    .build();

            pokemon.getAbilities().add(pokemonAbility);
        }
    }

    private Ability findOrCreateAbility(String name) {
        return abilityRepository.findByName(name)
                .orElseGet(() -> abilityRepository.save(
                        Ability.builder().name(name).build()));
    }

    private void attachSpeciesData(Pokemon pokemon, int pokeapiId) {
        PokeApiSpeciesDTO species = pokeApiClient.fetchSpecies(pokeapiId);

        if (species.evolvesFromSpecies() == null) {
            return;
        }

        Integer fromPokeapiId = extractIdFromUrl(species.evolvesFromSpecies().url());

        pokemonRepository.findByPokeapiId(fromPokeapiId).ifPresent(fromPokemon -> {
            pokemon.setEvolvesFrom(fromPokemon);
            pokemonRepository.save(pokemon);
        });
    }

    private Integer extractIdFromUrl(String url) {
        String[] parts = url.split("/");
        return Integer.parseInt(parts[parts.length - 1]);
    }

    private Pokemon toEntity(PokeApiPokemonDTO dto) {
        Map<String, Integer> statsByName = dto.stats().stream()
                .collect(java.util.stream.Collectors.toMap(
                        s -> s.stat().name(),
                        PokeApiStatSlotDTO::baseStat
                ));

        List<PokemonType> types = dto.types().stream()
                .sorted((a, b) -> a.slot().compareTo(b.slot()))
                .map(t -> parseType(t.type().name()))
                .toList();

        String imageUrl = dto.sprites() != null
                && dto.sprites().other() != null
                && dto.sprites().other().officialArtwork() != null
                ? dto.sprites().other().officialArtwork().frontDefault()
                : null;

        return Pokemon.builder()
                .pokeapiId(dto.id())
                .name(dto.name())
                .primaryType(types.get(0))
                .secondaryType(types.size() > 1 ? types.get(1) : null)
                .height(dto.height())
                .weight(dto.weight())
                .hp(statsByName.get("hp"))
                .attack(statsByName.get("attack"))
                .defense(statsByName.get("defense"))
                .specialAttack(statsByName.get("special-attack"))
                .specialDefense(statsByName.get("special-defense"))
                .speed(statsByName.get("speed"))
                .imageUrl(imageUrl)
                .build();
    }

    private PokemonType parseType(String pokeApiTypeName) {
        return PokemonType.valueOf(pokeApiTypeName.toUpperCase());
    }
}