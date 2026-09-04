package com.projetopokemanager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projetopokemanager.entity.PokemonCollectionEntry;

public interface PokemonCollectionEntryRepository extends JpaRepository<PokemonCollectionEntry, Long> {

    List<PokemonCollectionEntry> findAllByUser_Id(Long userId);

    Optional<PokemonCollectionEntry> findByIdAndUser_Id(Long id, Long userId);
}