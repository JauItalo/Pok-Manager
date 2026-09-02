package com.projetopokemanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projetopokemanager.dto.PokemonEffectivenessResponseDTO;
import com.projetopokemanager.dto.PokemonEvolutionResponseDTO;
import com.projetopokemanager.dto.PokemonResponseDTO;
import com.projetopokemanager.entity.enums.PokemonType;
import com.projetopokemanager.service.PokemonService;
import com.projetopokemanager.service.PokemonSyncService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pokemon")
@RequiredArgsConstructor
public class PokemonController {

    private final PokemonService pokemonService;
    private final PokemonSyncService pokemonSyncService;

    @GetMapping
    public List<PokemonResponseDTO> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) PokemonType type
    ) {
        return pokemonService.search(name, type);
    }

    @PostMapping("/sync")
    public String sync(
            @RequestParam(defaultValue = "1") int startId,
            @RequestParam(defaultValue = "151") int endId
    ) {
        pokemonSyncService.syncRange(startId, endId);
        return "Sincronização concluída de %d até %d".formatted(startId, endId);
    }

    @GetMapping("/{id}")
    public PokemonResponseDTO findById(@PathVariable Long id) {
        return pokemonService.findById(id);
    }

    @GetMapping("/{id}/effectiveness")
    public PokemonEffectivenessResponseDTO getEffectiveness(@PathVariable Long id) {
        return pokemonService.getEffectiveness(id);
    }

    @GetMapping("/{id}/evolutions")
    public PokemonEvolutionResponseDTO getEvolutions(@PathVariable Long id) {
        return pokemonService.getEvolutions(id);
    }
}
