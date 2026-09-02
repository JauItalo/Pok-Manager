package com.projetopokemanager.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyEmailRequestDTO(
        @NotBlank(message = "Token é obrigatório")
        String token
) {
}