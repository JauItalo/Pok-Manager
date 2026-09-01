package com.projetopokemanager.dto;

import java.util.List;

public record PokemonEffectivenessResponseDTO(
        List<TypeEffectivenessDTO> weaknesses,
        List<TypeEffectivenessDTO> resistances,
        List<TypeEffectivenessDTO> immunities
) {
}