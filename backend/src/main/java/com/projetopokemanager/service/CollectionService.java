package com.projetopokemanager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.AddToCollectionRequestDTO;
import com.projetopokemanager.dto.CollectionEntryResponseDTO;
import com.projetopokemanager.dto.PokemonSummaryDTO;
import com.projetopokemanager.dto.UpdateCollectionEntryRequestDTO;
import com.projetopokemanager.entity.Ability;
import com.projetopokemanager.entity.Pokemon;
import com.projetopokemanager.entity.PokemonCollectionEntry;
import com.projetopokemanager.entity.User;
import com.projetopokemanager.exception.InvalidCollectionDataException;
import com.projetopokemanager.exception.ResourceNotFoundException;
import com.projetopokemanager.repository.AbilityRepository;
import com.projetopokemanager.repository.PokemonCollectionEntryRepository;
import com.projetopokemanager.repository.PokemonRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final PokemonCollectionEntryRepository collectionRepository;
    private final PokemonRepository pokemonRepository;
    private final AbilityRepository abilityRepository;

    public CollectionEntryResponseDTO addToCollection(User user, AddToCollectionRequestDTO request) {
        Pokemon pokemon = pokemonRepository.findById(request.pokemonId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pokémon não encontrado com id: " + request.pokemonId()));

        PokemonCollectionEntry entry = PokemonCollectionEntry.builder()
                .user(user)
                .pokemon(pokemon)
                .build();

        PokemonCollectionEntry saved = collectionRepository.save(entry);

        return toDTO(saved);
    }

    public List<CollectionEntryResponseDTO> listCollection(User user) {
        return collectionRepository.findAllByUser_Id(user.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CollectionEntryResponseDTO getEntry(User user, Long entryId) {
        PokemonCollectionEntry entry = findOwnedEntry(user, entryId);
        return toDTO(entry);
    }

    public CollectionEntryResponseDTO updateEntry(
            User user, Long entryId, UpdateCollectionEntryRequestDTO request) {

        PokemonCollectionEntry entry = findOwnedEntry(user, entryId);

        if (request.captured() != null) {
            entry.setCaptured(request.captured());
        }
        if (request.level() != null) {
            entry.setLevel(request.level());
        }
        if (request.nature() != null) {
            entry.setNature(request.nature());
        }
        if (request.nickname() != null) {
            entry.setNickname(request.nickname());
        }
        if (request.favorite() != null) {
            entry.setFavorite(request.favorite());
        }
        if (request.obtainedMethod() != null) {
            entry.setObtainedMethod(request.obtainedMethod());
        }
        if (request.abilityId() != null) {
            entry.setAbility(resolveAbility(entry.getPokemon(), request.abilityId()));
        }

        PokemonCollectionEntry saved = collectionRepository.save(entry);

        return toDTO(saved);
    }

    public void removeFromCollection(User user, Long entryId) {
        PokemonCollectionEntry entry = findOwnedEntry(user, entryId);
        collectionRepository.delete(entry);
    }

    private PokemonCollectionEntry findOwnedEntry(User user, Long entryId) {
        return collectionRepository.findByIdAndUser_Id(entryId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Entrada de coleção não encontrada: " + entryId));
    }

    private Ability resolveAbility(Pokemon pokemon, Long abilityId) {
        Ability ability = abilityRepository.findById(abilityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Habilidade não encontrada com id: " + abilityId));

        boolean belongsToPokemon = pokemon.getAbilities().stream()
                .anyMatch(pa -> pa.getAbility().getId().equals(abilityId));

        if (!belongsToPokemon) {
            throw new InvalidCollectionDataException(
                    "A habilidade '" + ability.getName() + "' não pertence a " + pokemon.getName());
        }

        return ability;
    }

    private CollectionEntryResponseDTO toDTO(PokemonCollectionEntry entry) {
        Pokemon pokemon = entry.getPokemon();

        PokemonSummaryDTO pokemonSummary = new PokemonSummaryDTO(
                pokemon.getId(),
                pokemon.getPokeapiId(),
                pokemon.getName(),
                pokemon.getImageUrl(),
                pokemon.getPrimaryType(),
                pokemon.getSecondaryType()
        );

        return new CollectionEntryResponseDTO(
                entry.getId(),
                pokemonSummary,
                entry.isCaptured(),
                entry.getLevel(),
                entry.getNature(),
                entry.getAbility() != null ? entry.getAbility().getName() : null,
                entry.getNickname(),
                entry.isFavorite(),
                entry.getObtainedMethod(),
                entry.getCreatedAt()
        );
    }
}