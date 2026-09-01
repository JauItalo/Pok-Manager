package com.projetopokemanager.service.typechart;

import java.util.EnumMap;
import java.util.Map;

import com.projetopokemanager.entity.enums.PokemonType;
import static com.projetopokemanager.entity.enums.PokemonType.BUG;
import static com.projetopokemanager.entity.enums.PokemonType.DARK;
import static com.projetopokemanager.entity.enums.PokemonType.DRAGON;
import static com.projetopokemanager.entity.enums.PokemonType.ELECTRIC;
import static com.projetopokemanager.entity.enums.PokemonType.FAIRY;
import static com.projetopokemanager.entity.enums.PokemonType.FIGHTING;
import static com.projetopokemanager.entity.enums.PokemonType.FIRE;
import static com.projetopokemanager.entity.enums.PokemonType.FLYING;
import static com.projetopokemanager.entity.enums.PokemonType.GHOST;
import static com.projetopokemanager.entity.enums.PokemonType.GRASS;
import static com.projetopokemanager.entity.enums.PokemonType.GROUND;
import static com.projetopokemanager.entity.enums.PokemonType.ICE;
import static com.projetopokemanager.entity.enums.PokemonType.NORMAL;
import static com.projetopokemanager.entity.enums.PokemonType.POISON;
import static com.projetopokemanager.entity.enums.PokemonType.PSYCHIC;
import static com.projetopokemanager.entity.enums.PokemonType.ROCK;
import static com.projetopokemanager.entity.enums.PokemonType.STEEL;
import static com.projetopokemanager.entity.enums.PokemonType.WATER;

public final class TypeChart {

    private static final Map<PokemonType, Map<PokemonType, Double>> CHART = new EnumMap<>(PokemonType.class);

    private TypeChart() {
    }

    static {
        chart(NORMAL, entry(ROCK, 0.5), entry(STEEL, 0.5), entry(GHOST, 0.0));

        chart(FIRE, entry(FIRE, 0.5), entry(WATER, 0.5), entry(GRASS, 2.0),
                entry(ICE, 2.0), entry(BUG, 2.0), entry(ROCK, 0.5),
                entry(DRAGON, 0.5), entry(STEEL, 2.0));

        chart(WATER, entry(FIRE, 2.0), entry(WATER, 0.5), entry(GRASS, 0.5),
                entry(GROUND, 2.0), entry(ROCK, 2.0), entry(DRAGON, 0.5));

        chart(ELECTRIC, entry(WATER, 2.0), entry(ELECTRIC, 0.5), entry(GRASS, 0.5),
                entry(GROUND, 0.0), entry(FLYING, 2.0), entry(DRAGON, 0.5));

        chart(GRASS, entry(FIRE, 0.5), entry(WATER, 2.0), entry(GRASS, 0.5),
                entry(POISON, 0.5), entry(GROUND, 2.0), entry(FLYING, 0.5),
                entry(BUG, 0.5), entry(ROCK, 2.0), entry(DRAGON, 0.5), entry(STEEL, 0.5));

        chart(ICE, entry(FIRE, 0.5), entry(WATER, 0.5), entry(GRASS, 2.0),
                entry(ICE, 0.5), entry(GROUND, 2.0), entry(FLYING, 2.0),
                entry(DRAGON, 2.0), entry(STEEL, 0.5));

        chart(FIGHTING, entry(NORMAL, 2.0), entry(ICE, 2.0), entry(POISON, 0.5),
                entry(FLYING, 0.5), entry(PSYCHIC, 0.5), entry(BUG, 0.5),
                entry(ROCK, 2.0), entry(GHOST, 0.0), entry(DARK, 2.0),
                entry(STEEL, 2.0), entry(FAIRY, 0.5));

        chart(POISON, entry(GRASS, 2.0), entry(POISON, 0.5), entry(GROUND, 0.5),
                entry(ROCK, 0.5), entry(GHOST, 0.5), entry(STEEL, 0.0), entry(FAIRY, 2.0));

        chart(GROUND, entry(FIRE, 2.0), entry(ELECTRIC, 2.0), entry(GRASS, 0.5),
                entry(POISON, 2.0), entry(FLYING, 0.0), entry(BUG, 0.5),
                entry(ROCK, 2.0), entry(STEEL, 2.0));

        chart(FLYING, entry(ELECTRIC, 0.5), entry(GRASS, 2.0), entry(FIGHTING, 2.0),
                entry(BUG, 2.0), entry(ROCK, 0.5), entry(STEEL, 0.5));

        chart(PSYCHIC, entry(FIGHTING, 2.0), entry(POISON, 2.0), entry(PSYCHIC, 0.5),
                entry(DARK, 0.0), entry(STEEL, 0.5));

        chart(BUG, entry(FIRE, 0.5), entry(GRASS, 2.0), entry(FIGHTING, 0.5),
                entry(POISON, 0.5), entry(FLYING, 0.5), entry(PSYCHIC, 2.0),
                entry(GHOST, 0.5), entry(DARK, 2.0), entry(STEEL, 0.5), entry(FAIRY, 0.5));

        chart(ROCK, entry(FIRE, 2.0), entry(ICE, 2.0), entry(FIGHTING, 0.5),
                entry(GROUND, 0.5), entry(FLYING, 2.0), entry(BUG, 2.0), entry(STEEL, 0.5));

        chart(GHOST, entry(NORMAL, 0.0), entry(PSYCHIC, 2.0), entry(GHOST, 2.0), entry(DARK, 0.5));

        chart(DRAGON, entry(DRAGON, 2.0), entry(STEEL, 0.5), entry(FAIRY, 0.0));

        chart(DARK, entry(FIGHTING, 0.5), entry(PSYCHIC, 2.0), entry(GHOST, 2.0),
                entry(DARK, 0.5), entry(FAIRY, 0.5));

        chart(STEEL, entry(FIRE, 0.5), entry(WATER, 0.5), entry(ELECTRIC, 0.5),
                entry(ICE, 2.0), entry(ROCK, 2.0), entry(STEEL, 0.5), entry(FAIRY, 2.0));

        chart(FAIRY, entry(FIRE, 0.5), entry(FIGHTING, 2.0), entry(POISON, 0.5),
                entry(DRAGON, 2.0), entry(DARK, 2.0), entry(STEEL, 0.5));
    }

    @SafeVarargs
    private static void chart(PokemonType attackingType, Map.Entry<PokemonType, Double>... entries) {
        Map<PokemonType, Double> defendingMap = new EnumMap<>(PokemonType.class);
        for (Map.Entry<PokemonType, Double> e : entries) {
            defendingMap.put(e.getKey(), e.getValue());
        }
        CHART.put(attackingType, defendingMap);
    }

    private static Map.Entry<PokemonType, Double> entry(PokemonType type, Double multiplier) {
        return Map.entry(type, multiplier);
    }

    /**
     * Multiplicador de dano de um ataque do tipo `attackingType`
     * contra um defensor do tipo `defendingType`.
     * Retorna 1.0 (neutro) se a combinação não estiver na tabela.
     */
    public static double getMultiplier(PokemonType attackingType, PokemonType defendingType) {
        return CHART.getOrDefault(attackingType, Map.of()).getOrDefault(defendingType, 1.0);
    }
}