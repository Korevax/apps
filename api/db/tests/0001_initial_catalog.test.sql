-- Integration smoke tests for 0001_initial_catalog.sql.
-- Run only against a disposable test database after applying migrations.
BEGIN;

INSERT INTO taxonomy_entity (id, kind, slug) VALUES
  ('genre.drama', 'genre', 'drama'),
  ('tag.misterio', 'tag', 'misterio'),
  ('classification.anime', 'classification', 'anime');

INSERT INTO taxonomy_label (taxonomy_id, taxonomy_kind, locale, label, normalized_label) VALUES
  ('genre.drama', 'genre', 'pt-BR', 'Drama', 'drama'),
  ('tag.misterio', 'tag', 'pt-BR', 'Mistério', 'misterio'),
  ('classification.anime', 'classification', 'pt-BR', 'Anime', 'anime');

INSERT INTO franchise (id, slug, title) VALUES
  ('franchise.example', 'example-franchise', 'Example Franchise');

INSERT INTO content (
  id, slug, title, type, editorial_status, franchise_id, metadata
) VALUES
  ('movie.example-one', 'example-one', 'Example One', 'movie', 'published', 'franchise.example', '{"runtimeMinutes": 90}'),
  ('movie.example-two', 'example-two', 'Example Two', 'movie', 'published', NULL, '{"runtimeMinutes": 95}');

INSERT INTO content_taxonomy (content_id, taxonomy_id, taxonomy_kind) VALUES
  ('movie.example-one', 'genre.drama', 'genre'),
  ('movie.example-one', 'tag.misterio', 'tag'),
  ('movie.example-one', 'classification.anime', 'classification');

INSERT INTO content_alternative_title (content_id, locale, title, normalized_title) VALUES
  ('movie.example-one', 'en', 'Example One Original', 'example one original');

INSERT INTO content_external_reference (content_id, provider, external_id, url) VALUES
  ('movie.example-one', 'imdb', 'tt0000001', 'https://www.imdb.com/title/tt0000001/');

INSERT INTO content_relation (source_content_id, target_content_id, relation_type) VALUES
  ('movie.example-one', 'movie.example-two', 'related');

DO $$
BEGIN
  BEGIN
    INSERT INTO content (id, slug, title, type)
    VALUES ('content.bad-anime-type', 'bad-anime-type', 'Bad Anime Type', 'anime');
    RAISE EXCEPTION 'Expected unsupported content type to be rejected';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;

  BEGIN
    INSERT INTO content_taxonomy (content_id, taxonomy_id, taxonomy_kind)
    VALUES ('movie.example-one', 'tag.misterio', 'genre');
    RAISE EXCEPTION 'Expected taxonomy kind mismatch to be rejected';
  EXCEPTION WHEN foreign_key_violation THEN
    NULL;
  END;

  BEGIN
    INSERT INTO content_external_reference (content_id, provider, external_id)
    VALUES ('movie.example-two', 'imdb', 'tt0000001');
    RAISE EXCEPTION 'Expected duplicate provider ID to be rejected';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;
END $$;

INSERT INTO collection (id, slug, title, editorial_status)
VALUES ('collection.example', 'example-collection', 'Example Collection', 'draft');

INSERT INTO collection_content (collection_id, content_id, position)
VALUES ('collection.example', 'movie.example-one', 0);

DO $$
BEGIN
  BEGIN
    UPDATE collection SET editorial_status = 'published' WHERE id = 'collection.example';
    RAISE EXCEPTION 'Expected one-item collection publication to be rejected';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;
END $$;

INSERT INTO collection_content (collection_id, content_id, position)
VALUES ('collection.example', 'movie.example-two', 1);

UPDATE collection SET editorial_status = 'published' WHERE id = 'collection.example';

DO $$
BEGIN
  BEGIN
    DELETE FROM collection_content
    WHERE collection_id = 'collection.example' AND content_id = 'movie.example-two';
    RAISE EXCEPTION 'Expected published collection to retain two items';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;
END $$;

ROLLBACK;
