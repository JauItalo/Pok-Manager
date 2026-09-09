package com.projetopokemanager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.AddPokemonToTeamRequestDTO;
import com.projetopokemanager.dto.CreateTeamRequestDTO;
import com.projetopokemanager.dto.PokemonSummaryDTO;
import com.projetopokemanager.dto.RenameTeamRequestDTO;
import com.projetopokemanager.dto.TeamMemberResponseDTO;
import com.projetopokemanager.dto.TeamResponseDTO;
import com.projetopokemanager.entity.Pokemon;
import com.projetopokemanager.entity.Team;
import com.projetopokemanager.entity.TeamPokemonEntry;
import com.projetopokemanager.entity.User;
import com.projetopokemanager.exception.DuplicatePokemonInTeamException;
import com.projetopokemanager.exception.ResourceNotFoundException;
import com.projetopokemanager.exception.TeamFullException;
import com.projetopokemanager.repository.PokemonRepository;
import com.projetopokemanager.repository.TeamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {

    private static final int MAX_TEAM_SIZE = 6;

    private final TeamRepository teamRepository;
    private final PokemonRepository pokemonRepository;

    public TeamResponseDTO createTeam(User user, CreateTeamRequestDTO request) {
        Team team = Team.builder()
                .user(user)
                .name(request.name())
                .build();

        Team saved = teamRepository.save(team);

        return toDTO(saved);
    }

    public List<TeamResponseDTO> listTeams(User user) {
        return teamRepository.findAllByUser_Id(user.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public TeamResponseDTO getTeam(User user, Long teamId) {
        return toDTO(findOwnedTeam(user, teamId));
    }

    public TeamResponseDTO renameTeam(User user, Long teamId, RenameTeamRequestDTO request) {
        Team team = findOwnedTeam(user, teamId);
        team.setName(request.name());
        return toDTO(teamRepository.save(team));
    }

    public void deleteTeam(User user, Long teamId) {
        teamRepository.delete(findOwnedTeam(user, teamId));
    }

    public TeamResponseDTO addPokemon(User user, Long teamId, AddPokemonToTeamRequestDTO request) {
        Team team = findOwnedTeam(user, teamId);

        if (team.getPokemons().size() >= MAX_TEAM_SIZE) {
            throw new TeamFullException(
                    "O time '" + team.getName() + "' já possui o máximo de " + MAX_TEAM_SIZE + " Pokémon");
        }

        Pokemon pokemon = pokemonRepository.findById(request.pokemonId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pokémon não encontrado com id: " + request.pokemonId()));

        boolean alreadyInTeam = team.getPokemons().stream()
                .anyMatch(entry -> entry.getPokemon().getId().equals(pokemon.getId()));

        if (alreadyInTeam) {
            throw new DuplicatePokemonInTeamException(
                    pokemon.getName() + " já está nesse time");
        }

        int nextSlot = team.getPokemons().stream()
                .mapToInt(TeamPokemonEntry::getSlot)
                .max()
                .orElse(0) + 1;

        TeamPokemonEntry entry = TeamPokemonEntry.builder()
                .team(team)
                .pokemon(pokemon)
                .slot(nextSlot)
                .build();

        team.getPokemons().add(entry);

        return toDTO(teamRepository.save(team));
    }

    public TeamResponseDTO removePokemon(User user, Long teamId, Long entryId) {
        Team team = findOwnedTeam(user, teamId);

        boolean removed = team.getPokemons().removeIf(entry -> entry.getId().equals(entryId));

        if (!removed) {
            throw new ResourceNotFoundException(
                    "Pokémon com entrada " + entryId + " não encontrado nesse time");
        }

        return toDTO(teamRepository.save(team));
    }

    public Team findOwnedTeam(User user, Long teamId) {
        return teamRepository.findByIdAndUser_Id(teamId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Time não encontrado: " + teamId));
    }

    private TeamResponseDTO toDTO(Team team) {
        List<TeamMemberResponseDTO> pokemons = team.getPokemons().stream()
                .map(entry -> {
                    Pokemon p = entry.getPokemon();
                    PokemonSummaryDTO summary = new PokemonSummaryDTO(
                            p.getId(), p.getPokeapiId(), p.getName(),
                            p.getImageUrl(), p.getPrimaryType(), p.getSecondaryType());
                    return new TeamMemberResponseDTO(entry.getId(), summary);
                })
                .toList();

        return new TeamResponseDTO(team.getId(), team.getName(), pokemons, team.getCreatedAt());
    }
}