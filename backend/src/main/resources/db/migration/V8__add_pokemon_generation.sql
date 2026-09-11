ALTER TABLE pokemon ADD COLUMN generation INTEGER;

UPDATE pokemon SET generation = CASE
    WHEN pokeapi_id BETWEEN 1 AND 151 THEN 1
    WHEN pokeapi_id BETWEEN 152 AND 251 THEN 2
    WHEN pokeapi_id BETWEEN 252 AND 386 THEN 3
    WHEN pokeapi_id BETWEEN 387 AND 493 THEN 4
    WHEN pokeapi_id BETWEEN 494 AND 649 THEN 5
    WHEN pokeapi_id BETWEEN 650 AND 721 THEN 6
    WHEN pokeapi_id BETWEEN 722 AND 809 THEN 7
    WHEN pokeapi_id BETWEEN 810 AND 905 THEN 8
    WHEN pokeapi_id BETWEEN 906 AND 1025 THEN 9
END;

ALTER TABLE pokemon ALTER COLUMN generation SET NOT NULL;

CREATE INDEX idx_pokemon_generation ON pokemon (generation);