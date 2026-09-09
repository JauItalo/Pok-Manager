package com.projetopokemanager.dto;

import java.util.List;

public record SyncResultDTO(
        int totalRequested,
        int synced,
        int skipped,
        List<Integer> failed
) {
}