CREATE TABLE pokemon (
    id                BIGSERIAL PRIMARY KEY,
    pokeapi_id        INTEGER NOT NULL UNIQUE,
    name              VARCHAR(100) NOT NULL,
    primary_type      VARCHAR(20) NOT NULL,
    secondary_type    VARCHAR(20),
    height            INTEGER,
    weight            INTEGER,
    hp                INTEGER NOT NULL,
    attack            INTEGER NOT NULL,
    defense           INTEGER NOT NULL,
    special_attack    INTEGER NOT NULL,
    special_defense   INTEGER NOT NULL,
    speed             INTEGER NOT NULL,
    image_url         VARCHAR(500),
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pokemon_name ON pokemon (name);
CREATE INDEX idx_pokemon_primary_type ON pokemon (primary_type);