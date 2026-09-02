ALTER TABLE pokemon
    ADD COLUMN evolves_from_pokemon_id BIGINT REFERENCES pokemon(id);

CREATE INDEX idx_pokemon_evolves_from ON pokemon (evolves_from_pokemon_id);