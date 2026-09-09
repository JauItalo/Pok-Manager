package com.projetopokemanager.dto;

import java.time.LocalDateTime;

public record ProfileResponseDTO(
        Long id,
        String username,
        String email,
        LocalDateTime memberSince,
        long collectionCount,
        long favoriteCount,
        long teamCount
) {
}