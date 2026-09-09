package com.projetopokemanager.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TeamResponseDTO(
        Long id,
        String name,
        List<TeamMemberResponseDTO> pokemons,
        LocalDateTime createdAt
) {
}