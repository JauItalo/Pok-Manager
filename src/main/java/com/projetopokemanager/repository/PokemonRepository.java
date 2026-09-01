package com.projetopokemanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.projetopokemanager.entity.Pokemon;
import com.projetopokemanager.entity.enums.PokemonType;

public interface PokemonRepository extends JpaRepository<Pokemon, Long> {

    boolean existsByPokeapiId(Integer pokeapiId);

    @Query("""
            SELECT p FROM Pokemon p
            WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
            AND (:type IS NULL OR p.primaryType = :type OR p.secondaryType = :type)
            ORDER BY p.pokeapiId
            """)
    List<Pokemon> search(@Param("name") String name, @Param("type") PokemonType type);
}