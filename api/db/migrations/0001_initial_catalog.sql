-- Korevax initial relational catalog schema.
-- Apply through the migration runner; do not execute this file from the browser.
BEGIN;

CREATE TABLE taxonomy_entity (
  id text PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 128),
  kind text NOT NULL CHECK (
    kind IN ('genre', 'tag', 'classification', 'language', 'region', 'age-rating', 'format')
  ),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  active boolean NOT NULL DEFAULT true,
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attributes) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, kind),
  UNIQUE (kind, slug),
  CHECK (updated_at >= created_at)
);

CREATE TABLE taxonomy_label (
  taxonomy_id text NOT NULL,
  taxonomy_kind text NOT NULL,
  locale text NOT NULL CHECK (locale ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  label text NOT NULL CHECK (length(trim(label)) BETWEEN 1 AND 160),
  normalized_label text NOT NULL CHECK (length(trim(normalized_label)) BETWEEN 1 AND 200),
  PRIMARY KEY (taxonomy_id, locale),
  UNIQUE (taxonomy_kind, locale, normalized_label),
  FOREIGN KEY (taxonomy_id, taxonomy_kind)
    REFERENCES taxonomy_entity (id, kind) ON DELETE CASCADE
);

CREATE TABLE taxonomy_alias (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  taxonomy_id text NOT NULL,
  taxonomy_kind text NOT NULL,
  locale text NOT NULL CHECK (locale ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  alias text NOT NULL CHECK (length(trim(alias)) BETWEEN 1 AND 160),
  normalized_alias text NOT NULL CHECK (length(trim(normalized_alias)) BETWEEN 1 AND 200),
  FOREIGN KEY (taxonomy_id, taxonomy_kind)
    REFERENCES taxonomy_entity (id, kind) ON DELETE CASCADE,
  UNIQUE (taxonomy_id, locale, normalized_alias),
  UNIQUE (taxonomy_kind, locale, normalized_alias)
);

CREATE TABLE franchise (
  id text PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 128),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 300),
  synopsis text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (updated_at >= created_at)
);

CREATE TABLE content (
  id text PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 128),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 300),
  original_title text CHECK (original_title IS NULL OR length(original_title) <= 300),
  synopsis text CHECK (synopsis IS NULL OR length(synopsis) <= 20000),
  type text NOT NULL CHECK (
    type IN ('movie', 'series', 'animation', 'book', 'manga', 'manhwa',
             'music', 'podcast', 'game', 'documentary')
  ),
  editorial_status text NOT NULL DEFAULT 'draft'
    CHECK (editorial_status IN ('draft', 'review', 'published', 'archived')),
  release_date date,
  original_language text
    CHECK (original_language IS NULL OR original_language ~ '^[A-Za-z]{2,8}(-[A-Za-z0-9]{1,8})*$'),
  franchise_id text REFERENCES franchise(id) ON DELETE SET NULL,
  poster_url text CHECK (poster_url IS NULL OR length(poster_url) <= 2048),
  backdrop_url text CHECK (backdrop_url IS NULL OR length(backdrop_url) <= 2048),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (updated_at >= created_at)
);

CREATE TABLE content_alternative_title (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content_id text NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 300),
  normalized_title text NOT NULL CHECK (length(trim(normalized_title)) BETWEEN 1 AND 320),
  UNIQUE (content_id, locale, normalized_title)
);

CREATE TABLE content_taxonomy (
  content_id text NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  taxonomy_id text NOT NULL,
  taxonomy_kind text NOT NULL CHECK (taxonomy_kind IN ('genre', 'tag', 'classification')),
  PRIMARY KEY (content_id, taxonomy_id),
  FOREIGN KEY (taxonomy_id, taxonomy_kind)
    REFERENCES taxonomy_entity (id, kind) ON DELETE RESTRICT
);

CREATE TABLE content_external_reference (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content_id text NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$'),
  external_id text NOT NULL CHECK (length(trim(external_id)) BETWEEN 1 AND 256),
  url text CHECK (url IS NULL OR length(url) <= 2048),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, external_id)
);

CREATE TABLE content_relation (
  source_content_id text NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  target_content_id text NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  relation_type text NOT NULL CHECK (
    relation_type IN ('sequel', 'prequel', 'spin-off', 'adaptation', 'remake', 'related')
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source_content_id, target_content_id, relation_type),
  CHECK (source_content_id <> target_content_id)
);

CREATE TABLE collection (
  id text PRIMARY KEY CHECK (length(id) BETWEEN 1 AND 128),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 300),
  description text CHECK (description IS NULL OR length(description) <= 20000),
  editorial_status text NOT NULL DEFAULT 'draft'
    CHECK (editorial_status IN ('draft', 'review', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (updated_at >= created_at)
);

CREATE TABLE collection_content (
  collection_id text NOT NULL REFERENCES collection(id) ON DELETE CASCADE,
  content_id text NOT NULL REFERENCES content(id) ON DELETE RESTRICT,
  position integer NOT NULL CHECK (position >= 0),
  PRIMARY KEY (collection_id, content_id),
  UNIQUE (collection_id, position)
);

CREATE INDEX content_public_type_release_idx
  ON content (type, release_date DESC)
  WHERE editorial_status = 'published';

CREATE INDEX content_public_updated_idx
  ON content (updated_at DESC)
  WHERE editorial_status = 'published';

CREATE INDEX content_franchise_idx ON content (franchise_id) WHERE franchise_id IS NOT NULL;
CREATE INDEX content_taxonomy_lookup_idx ON content_taxonomy (taxonomy_kind, taxonomy_id, content_id);
CREATE INDEX content_relation_target_idx ON content_relation (target_content_id, relation_type);
CREATE INDEX alternative_title_lookup_idx ON content_alternative_title (locale, normalized_title);
CREATE INDEX external_reference_content_idx ON content_external_reference (content_id);
CREATE INDEX collection_public_updated_idx
  ON collection (updated_at DESC)
  WHERE editorial_status = 'published';

CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER taxonomy_entity_set_updated_at
  BEFORE UPDATE ON taxonomy_entity FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER franchise_set_updated_at
  BEFORE UPDATE ON franchise FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER content_set_updated_at
  BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER collection_set_updated_at
  BEFORE UPDATE ON collection FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE FUNCTION enforce_published_collection_minimum() RETURNS trigger AS $$
DECLARE
  target_collection_id text;
  target_status text;
  member_count integer;
BEGIN
  IF TG_TABLE_NAME = 'collection' THEN
    target_collection_id := NEW.id;
    target_status := NEW.editorial_status;
  ELSE
    IF TG_OP = 'DELETE' THEN
      target_collection_id := OLD.collection_id;
    ELSE
      target_collection_id := NEW.collection_id;
    END IF;

    SELECT editorial_status
      INTO target_status
      FROM collection
      WHERE id = target_collection_id;
  END IF;

  IF target_status = 'published' THEN
    SELECT count(*)
      INTO member_count
      FROM collection_content
      WHERE collection_id = target_collection_id;

    IF member_count < 2 THEN
      RAISE EXCEPTION 'Published collections must contain at least two distinct content records'
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER collection_minimum_on_publish
  BEFORE INSERT OR UPDATE OF editorial_status ON collection
  FOR EACH ROW EXECUTE FUNCTION enforce_published_collection_minimum();

CREATE TRIGGER collection_minimum_on_membership_change
  AFTER INSERT OR DELETE ON collection_content
  FOR EACH ROW EXECUTE FUNCTION enforce_published_collection_minimum();

COMMENT ON TABLE content IS 'Canonical Korevax catalog records; external providers are not the source of truth.';
COMMENT ON COLUMN content.metadata IS 'Type-specific JSON object; API runtime validation must enforce the ContentType-specific schema.';
COMMENT ON TABLE content_taxonomy IS 'Canonical genre, tag and classification references with kind-enforced foreign keys.';
COMMENT ON TABLE content_external_reference IS 'Provider-scoped identifiers; never use these as the canonical Korevax content ID.';
COMMENT ON TABLE collection_content IS 'Ordered membership; published collections require at least two distinct content records.';

COMMIT;
