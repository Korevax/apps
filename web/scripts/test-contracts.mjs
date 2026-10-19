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
const contentRules = await loadTypeScript("content.rules.ts", {
  "./content.validation": contentValidation.url,
  "./taxonomy.rules": taxonomyRules.url,
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
assert.deepEqual(contentRules.module.getContentIntegrityErrors(validContent), [], "valid content should pass domain integrity");
assert.equal(contentValidation.module.isContent({ ...validContent, type: "anime" }), false, "anime must not be a ContentType");
assert.equal(contentValidation.module.isContent({ ...validContent, genreIds: ["genre.drama", "genre.drama"] }), false, "duplicate taxonomy references should be rejected");
assert.equal(contentValidation.module.isContent({ ...validContent, releaseDate: "2026-02-31" }), false, "impossible release dates should be rejected");
assert.match(
  contentRules.module.getContentIntegrityErrors({ ...validContent, genreIds: ["genre.missing"] }).join(" "),
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
    updatedAt: "2026-02-31T00:00:00Z",
  }).join(" "),
  /updatedAt/i,
  "impossible timestamps should be rejected",
);

console.log("Contract tests passed: content identity, taxonomy references, external IDs, localized labels and date boundaries.");
