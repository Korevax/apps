import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const headersPath = new URL("../public/_headers", import.meta.url);
const headers = await readFile(headersPath, "utf8");
const normalized = headers.toLowerCase();

assert.match(normalized, /x-content-type-options:\s*nosniff/, "MIME sniffing protection is required");
assert.match(normalized, /x-frame-options:\s*deny/, "framing must be denied");
assert.match(normalized, /referrer-policy:\s*strict-origin-when-cross-origin/, "referrer policy must be restrictive");
assert.match(normalized, /permissions-policy:.*camera=\(\)/, "camera access must be disabled");
assert.match(normalized, /permissions-policy:.*microphone=\(\)/, "microphone access must be disabled");
assert.match(normalized, /content-security-policy:.*default-src 'self'/, "CSP must default to same-origin");
assert.match(normalized, /content-security-policy:.*object-src 'none'/, "object embeds must be disabled");
assert.match(normalized, /content-security-policy:.*frame-ancestors 'none'/, "framing must be denied by CSP");
assert.match(normalized, /content-security-policy:.*script-src 'self'/, "scripts must be same-origin");
assert.doesNotMatch(normalized, /script-src[^;]*unsafe-eval/, "unsafe-eval must not be enabled");
assert.doesNotMatch(normalized, /connect-src[^;]*\*/, "connect-src must not allow wildcard origins");

console.log("Security header checks passed.");
