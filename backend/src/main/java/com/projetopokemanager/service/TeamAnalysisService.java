package com.projetopokemanager.service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.PokemonEffectivenessResponseDTO;
import com.projetopokemanager.dto.TeamAnalysisResponseDTO;
import com.projetopokemanager.dto.TeamSuggestionDTO;
import com.projetopokemanager.dto.TeamTypeScoreDTO;
import com.projetopokemanager.dto.TypeEffectivenessDTO;
import com.projetopokemanager.entity.Pokemon;
import com.projetopokemanager.entity.Team;
import com.projetopokemanager.entity.TeamPokemonEntry;
import com.projetopokemanager.entity.enums.PokemonType;
import com.projetopokemanager.service.typechart.TypeChart;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamAnalysisService {

    private final TypeEffectivenessService typeEffectivenessService;

    public TeamAnalysisResponseDTO analyze(Team team) {
        List<TeamPokemonEntry> members = team.getPokemons();

        if (members.isEmpty()) {
            return new TeamAnalysisResponseDTO(List.of(), 0, 0, List.of());
        }

        List<TeamTypeScoreDTO> weaknesses = calculateWeaknesses(members);
        int coverage = calculateCoverage(members);
        int balance = calculateBalance(members);
        List<TeamSuggestionDTO> suggestions = buildSuggestions(weaknesses);

        return new TeamAnalysisResponseDTO(weaknesses, coverage, balance, suggestions);
    }

    private List<TeamTypeScoreDTO> calculateWeaknesses(List<TeamPokemonEntry> members) {
        Map<PokemonType, Integer> weaknessCount = new EnumMap<>(PokemonType.class);

        for (TeamPokemonEntry entry : members) {
            Pokemon pokemon = entry.getPokemon();

            PokemonEffectivenessResponseDTO effectiveness = typeEffectivenessService.calculate(
                    pokemon.getPrimaryType(), pokemon.getSecondaryType());

            for (TypeEffectivenessDTO weakness : effectiveness.weaknesses()) {
                weaknessCount.merge(weakness.type(), 1, Integer::sum);
            }
        }

        int teamSize = members.size();

        return weaknessCount.entrySet().stream()
                .map(e -> new TeamTypeScoreDTO(e.getKey(), percentage(e.getValue(), teamSize)))
                .sorted(Comparator.comparingInt(TeamTypeScoreDTO::percentage).reversed())
                .toList();
    }

    private int calculateCoverage(List<TeamPokemonEntry> members) {
        Set<PokemonType> teamTypes = collectTeamTypes(members);

        long coveredCount = Arrays.stream(PokemonType.values())
                .filter(defendingType -> teamTypes.stream()
                        .anyMatch(attackingType ->
                                TypeChart.getMultiplier(attackingType, defendingType) >= 1.0))
                .count();

        return percentage((int) coveredCount, PokemonType.values().length);
    }

    private int calculateBalance(List<TeamPokemonEntry> members) {
        Set<PokemonType> teamTypes = collectTeamTypes(members);

        int maxPossibleTypes = Math.min(members.size() * 2, PokemonType.values().length);

        return percentage(teamTypes.size(), maxPossibleTypes);
    }

    private List<TeamSuggestionDTO> buildSuggestions(List<TeamTypeScoreDTO> weaknesses) {
        return weaknesses.stream()
                .filter(w -> w.percentage() > 0)
                .limit(2)
                .map(w -> new TeamSuggestionDTO(
                        w.type(),
                        w.percentage(),
                        findResistantTypes(w.type())))
                .toList();
    }

    private List<PokemonType> findResistantTypes(PokemonType attackingType) {
        return Arrays.stream(PokemonType.values())
                .filter(defendingType -> TypeChart.getMultiplier(attackingType, defendingType) <= 0.5)
                .sorted(Comparator.comparingDouble(
                        defendingType -> TypeChart.getMultiplier(attackingType, defendingType)))
                .limit(2)
                .toList();
    }

    private Set<PokemonType> collectTeamTypes(List<TeamPokemonEntry> members) {
        Set<PokemonType> types = new HashSet<>();
        for (TeamPokemonEntry entry : members) {
            types.add(entry.getPokemon().getPrimaryType());
            if (entry.getPokemon().getSecondaryType() != null) {
                types.add(entry.getPokemon().getSecondaryType());
            }
        }
        return types;
    }

    private int percentage(int part, int total) {
        if (total == 0) return 0;
        return (int) Math.round((part * 100.0) / total);
    }
}