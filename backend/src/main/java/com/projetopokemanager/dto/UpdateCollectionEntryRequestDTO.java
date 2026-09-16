package com.projetopokemanager.dto;

import com.projetopokemanager.entity.enums.Nature;

public record UpdateCollectionEntryRequestDTO(
        Boolean captured,
        Integer level,
        Nature nature,
        Long abilityId,
        String nickname,
        Boolean favorite,
        String obtainedMethod,
        Boolean shiny
) {
}