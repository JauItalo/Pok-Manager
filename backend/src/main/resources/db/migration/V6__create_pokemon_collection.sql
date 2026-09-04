CREATE TABLE pokemon_collection (
    id                BIGSERIAL PRIMARY KEY,
    user_id           BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    pokemon_id        BIGINT NOT NULL REFERENCES pokemon(id),
    captured          BOOLEAN NOT NULL DEFAULT TRUE,
    level             INTEGER,
    nature            VARCHAR(20),
    ability_id        BIGINT REFERENCES ability(id),
    nickname          VARCHAR(50),
    favorite          BOOLEAN NOT NULL DEFAULT FALSE,
    obtained_method   VARCHAR(255),
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pokemon_collection_user ON pokemon_collection (user_id);