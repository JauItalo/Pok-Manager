package com.projetopokemanager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.projetopokemanager.dto.AddToCollectionRequestDTO;
import com.projetopokemanager.dto.CollectionEntryResponseDTO;
import com.projetopokemanager.dto.UpdateCollectionEntryRequestDTO;
import com.projetopokemanager.entity.User;
import com.projetopokemanager.service.CollectionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/collection")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollectionEntryResponseDTO addToCollection(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddToCollectionRequestDTO request
    ) {
        return collectionService.addToCollection(user, request);
    }

    @GetMapping
    public List<CollectionEntryResponseDTO> listCollection(@AuthenticationPrincipal User user) {
        return collectionService.listCollection(user);
    }

    @GetMapping("/{id}")
    public CollectionEntryResponseDTO getEntry(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        return collectionService.getEntry(user, id);
    }

    @PatchMapping("/{id}")
    public CollectionEntryResponseDTO updateEntry(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCollectionEntryRequestDTO request
    ) {
        return collectionService.updateEntry(user, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFromCollection(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        collectionService.removeFromCollection(user, id);
    }
}