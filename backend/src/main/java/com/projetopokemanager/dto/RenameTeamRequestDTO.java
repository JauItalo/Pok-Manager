package com.projetopokemanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RenameTeamRequestDTO(
        @NotBlank(message = "Nome do time é obrigatório")
        @Size(max = 50, message = "Nome deve ter no máximo 50 caracteres")
        String name
) {
}