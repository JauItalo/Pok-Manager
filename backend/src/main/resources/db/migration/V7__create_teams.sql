CREATE TABLE team (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    name        VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE team_pokemon (
    id          BIGSERIAL PRIMARY KEY,
    team_id     BIGINT NOT NULL REFERENCES team(id) ON DELETE CASCADE,
    pokemon_id  BIGINT NOT NULL REFERENCES pokemon(id),
    slot        INTEGER NOT NULL,
    UNIQUE (team_id, slot),
    UNIQUE (team_id, pokemon_id)
);

CREATE INDEX idx_team_user ON team (user_id);
CREATE INDEX idx_team_pokemon_team ON team_pokemon (team_id);