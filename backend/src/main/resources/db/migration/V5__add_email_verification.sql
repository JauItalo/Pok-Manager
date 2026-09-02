ALTER TABLE app_user
    ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE user_token (
    id          BIGSERIAL PRIMARY KEY,
    token       VARCHAR(255) NOT NULL UNIQUE,
    user_id     BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    type        VARCHAR(30) NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    used        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_token_token ON user_token (token);