import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const domainUrl = new URL("../src/domain/catalog/", import.meta.url);

function toDataUrl(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}

async function loadTypeScript(relativePath, replacements = {}) {
  const source = await readFile(new URL(relativePath, domainUrl), "utf8");
  let javascript = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    reportDiagnostics: true,
  }).outputText;

  for (const [specifier, targetUrl] of Object.entries(replacements)) {
    javascript = javascript.replaceAll(JSON.stringify(specifier), JSON.stringify(targetUrl));
  }

  const url = toDataUrl(javascript);
  return { module: await import(url), url };
}

const types = await loadTypeScript("content.types.ts");
const contentValidation = await loadTypeScript("content.validation.ts", {
  "./content.types": types.url,
});
const taxonomyValidation = await loadTypeScript("taxonomy.validation.ts");
const taxonomySeed = await loadTypeScript("taxonomy.seed.ts");
const taxonomyRules = await loadTypeScript("taxonomy.rules.ts", {
  "./taxonomy.seed": taxonomySeed.url,
});
const taxonomyServices = await loadTypeScript("../../services/catalog/taxonomy.services.ts", {
  "../../domain/catalog/taxonomy.seed": taxonomySeed.url,
});
const contentRules = await loadTypeScript("content.rules.ts", {
  "./content.validation": contentValidation.url,
});

const validContent = {
  id: "content-test-1",
  slug: "content-test-1",
  title: "Contract Test",
  alternativeTitles: [],
  synopsis: null,
  type: "movie",
  genreIds: ["genre.drama"],
  tagIds: ["tag.misterio"],
  classificationIds: [],
  status: "published",
  releaseDate: "2026-05-15",
  originalLanguage: "pt-BR",
  metadata: { runtimeMinutes: 90 },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
};

assert.equal(contentValidation.module.isContent(validContent), true, "valid content should pass runtime validation");

const baseContent = { ...validContent };
delete baseContent.metadata;
for (const type of types.module.CONTENT_TYPES) {
  assert.equal(
    contentValidation.module.isContent({ ...baseContent, type }),
    true,
    `supported ContentType should validate: ${type}`,
  );
}
assert.equal(contentValidation.module.isContent({ ...validContent, title: "x".repeat(301) }), false, "title length limit should be enforced");
assert.equal(contentValidation.module.isContent({ ...validContent, createdAt: "2026-01-01T00:00:00" }), false, "timestamps without timezone should be rejected");
assert.equal(contentValidation.module.isContent({ ...validContent, posterUrl: "javascript:alert(1)" }), false, "unsafe image protocols should be rejected");
assert.match(
  contentRules.module.getCatalogIntegrityErrors([
    validContent,
    { ...validContent, id: "content-test-2", slug: validContent.slug },
  ]).join(" "),
  /slug duplicado/i,
  "duplicate catalog slugs should fail integrity checks",
);
assert.deepEqual(contentRules.module.getContentIntegrityErrors(validContent), [], "valid content should pass domain integrity");
assert.equal(contentValidation.module.isContent({ ...validContent, type: "anime" }), false, "anime must not be a ContentType");
assert.equal(contentValidation.module.isContent({ ...validContent, genreIds: ["genre.drama", "genre.drama"] }), false, "duplicate taxonomy references should be rejected");
assert.equal(contentValidation.module.isContent({ ...validContent, releaseDate: "2026-02-31" }), false, "impossible release dates should be rejected");
assert.match(
  taxonomyRules.module.getTaxonomyReferenceErrors(["genre.missing"], []).join(" "),
  /gênero inexistente/i,
  "unknown taxonomy references should fail catalog integrity",
);
assert.match(
  contentRules.module.getContentIntegrityErrors({
    ...validContent,
    externalReferences: [
      { provider: "example", externalId: "same-id" },
      { provider: "EXAMPLE", externalId: "same-id" },
    ],
  }).join(" "),
  /externalReferences/i,
  "duplicate provider-scoped external references should be rejected",
);

const validGenre = {
  id: "genre.drama",
  kind: "genre",
  slug: "drama",
  active: true,
  labels: { "pt-BR": "Drama" },
  aliases: { "pt-BR": ["Drama dramático"] },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
};
assert.deepEqual(taxonomyValidation.module.getTaxonomyValidationErrors(validGenre), [], "valid localized taxonomy should pass");
assert.equal(
  taxonomyServices.module.matchesTaxonomyTerm(
    taxonomyServices.module.getGenreById("genre.ficcao-cientifica"),
    "ficcao cientifica",
  ),
  true,
  "taxonomy search should ignore accent differences",
);
assert.equal(
  taxonomyServices.module.getGenreLabel(
    taxonomyServices.module.getGenreById("genre.ficcao-cientifica"),
    "en",
  ),
  "Science fiction",
  "taxonomy labels should resolve by locale",
);
assert.match(
  taxonomyValidation.module.getTaxonomyValidationErrors({
    ...validGenre,
    aliases: { "pt-BR": [" drama "] },
  }).join(" "),
  /alias/i,
  "invalid whitespace around aliases should be rejected",
);
assert.match(
  taxonomyValidation.module.getTaxonomyValidationErrors({
    ...validGenre,
    aliases: { "pt-BR": ["Drama"] },
  }).join(" "),
  /não devem se repetir/i,
  "an alias must not duplicate its localized canonical label",
);
assert.match(
  taxonomyValidation.module.getTaxonomyValidationErrors({
    ...validGenre,
    aliases: { "pt-BR": ["Café", "cafe"] },
  }).join(" "),
  /aliases.*duplicados após normalização/i,
  "alias duplicates should be accent-insensitive",
);
assert.match(
  taxonomyValidation.module.getTaxonomyValidationErrors({
    ...validGenre,
    updatedAt: "2026-02-31T00:00:00Z",
  }).join(" "),
  /updatedAt/i,
  "impossible timestamps should be rejected",
);

console.log("Contract tests passed: content identity, taxonomy references, external IDs, localized labels and date boundaries.");
