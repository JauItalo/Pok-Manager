package com.projetopokemanager.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.projetopokemanager.dto.PokemonEffectivenessResponseDTO;
import com.projetopokemanager.dto.TypeEffectivenessDTO;
import com.projetopokemanager.entity.enums.PokemonType;
import com.projetopokemanager.service.typechart.TypeChart;

@Service
public class TypeEffectivenessService {

    /**
     * Calcula o multiplicador de dano contra um Pokémon (1 ou 2 tipos)
     * para cada um dos 18 tipos de ataque existentes.
     */
    public PokemonEffectivenessResponseDTO calculate(PokemonType primaryType, PokemonType secondaryType) {
        List<TypeEffectivenessDTO> all = java.util.Arrays.stream(PokemonType.values())
                .map(attackingType -> {
                    double multiplier = TypeChart.getMultiplier(attackingType, primaryType);
                    if (secondaryType != null) {
                        multiplier *= TypeChart.getMultiplier(attackingType, secondaryType);
                    }
                    return new TypeEffectivenessDTO(attackingType, multiplier);
                })
                .toList();

        List<TypeEffectivenessDTO> weaknesses = all.stream()
                .filter(e -> e.multiplier() > 1.0)
                .sorted(Comparator.comparingDouble(TypeEffectivenessDTO::multiplier).reversed())
                .toList();

        List<TypeEffectivenessDTO> resistances = all.stream()
                .filter(e -> e.multiplier() < 1.0 && e.multiplier() > 0.0)
                .sorted(Comparator.comparingDouble(TypeEffectivenessDTO::multiplier))
                .toList();

        List<TypeEffectivenessDTO> immunities = all.stream()
                .filter(e -> e.multiplier() == 0.0)
                .toList();

        return new PokemonEffectivenessResponseDTO(weaknesses, resistances, immunities);
    }
}