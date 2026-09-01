CREATE TABLE ability (
    id      BIGSERIAL PRIMARY KEY,
    name    VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE pokemon_ability (
    id          BIGSERIAL PRIMARY KEY,
    pokemon_id  BIGINT NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
    ability_id  BIGINT NOT NULL REFERENCES ability(id),
    is_hidden   BOOLEAN NOT NULL DEFAULT FALSE,
    slot        INTEGER NOT NULL,
    UNIQUE (pokemon_id, ability_id)
);

CREATE INDEX idx_pokemon_ability_pokemon ON pokemon_ability (pokemon_id);