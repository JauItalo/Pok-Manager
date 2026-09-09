package com.projetopokemanager.dto;

import java.util.List;

public record TeamAnalysisResponseDTO(
        List<TeamTypeScoreDTO> weaknesses,
        int typeCoverage,
        int balance,
        List<TeamSuggestionDTO> suggestions
) {
}