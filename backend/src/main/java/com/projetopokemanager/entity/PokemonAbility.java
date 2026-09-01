package com.projetopokemanager.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pokemon_ability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PokemonAbility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pokemon_id", nullable = false)
    private Pokemon pokemon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ability_id", nullable = false)
    private Ability ability;

    @Column(name = "is_hidden", nullable = false)
    private boolean hidden;

    @Column(nullable = false)
    private Integer slot;
}