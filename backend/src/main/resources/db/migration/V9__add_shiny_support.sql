ALTER TABLE pokemon ADD COLUMN shiny_image_url VARCHAR(500);

UPDATE pokemon
SET shiny_image_url = REPLACE(image_url, '/official-artwork/', '/official-artwork/shiny/')
WHERE image_url IS NOT NULL;

ALTER TABLE pokemon_collection ADD COLUMN shiny BOOLEAN NOT NULL DEFAULT FALSE;