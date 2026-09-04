package com.projetopokemanager.dto;

import com.projetopokemanager.entity.enums.Nature;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateCollectionEntryRequestDTO(
        Boolean captured,

        @Min(value = 1, message = "Nível mínimo é 1")
        @Max(value = 100, message = "Nível máximo é 100")
        Integer level,

        Nature nature,

        Long abilityId,

        @Size(max = 50, message = "Apelido deve ter no máximo 50 caracteres")
        String nickname,

        Boolean favorite,

        @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
        String obtainedMethod
) {
}