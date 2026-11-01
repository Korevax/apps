import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

const port = 18_787;
const baseUrl = `http://127.0.0.1:${port}`;
const child = spawn(
  process.execPath,
  ["--env-file-if-exists=.env.local", "server/catalog-gateway.mjs"],
  {
    cwd: new URL("../", import.meta.url),
    env: {
      ...process.env,
      GATEWAY_HOST: "127.0.0.1",
      GATEWAY_PORT: String(port),
      GATEWAY_ALLOWED_ORIGINS: "http://localhost:5173",
      TMDB_API_READ_ACCESS_TOKEN: "test-token-with-no-real-provider-access",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let stderr = "";
child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => { stderr += chunk; });

async function waitForServer() {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Gateway exited during startup: ${stderr}`);
    }
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // The process may still be binding its local socket.
    }
    await delay(50);
  }
  throw new Error(`Gateway did not become healthy: ${stderr}`);
}

try {
  await waitForServer();

  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok", provider: "tmdb" });

  const missingQuery = await fetch(`${baseUrl}/api/catalog/movie/search`);
  assert.equal(missingQuery.status, 400);
  assert.match((await missingQuery.json()).error, /query/i);

  const invalidPage = await fetch(`${baseUrl}/api/catalog/movie/search?query=matrix&page=0`);
  assert.equal(invalidPage.status, 400);

  const tooLongQuery = await fetch(
    `${baseUrl}/api/catalog/movie/search?query=${"x".repeat(121)}`,
  );
  assert.equal(tooLongQuery.status, 400);

  const unknownRoute = await fetch(`${baseUrl}/api/catalog/anime/search?query=naruto`);
  assert.equal(unknownRoute.status, 404);

  const unsupportedMethod = await fetch(`${baseUrl}/api/catalog/movie/search?query=matrix`, {
    method: "POST",
  });
  assert.equal(unsupportedMethod.status, 405);
  assert.equal(unsupportedMethod.headers.get("allow"), "GET, OPTIONS");

  const allowedOrigin = await fetch(`${baseUrl}/health`, {
    headers: { Origin: "http://localhost:5173" },
  });
  assert.equal(allowedOrigin.headers.get("access-control-allow-origin"), "http://localhost:5173");

  const deniedOrigin = await fetch(`${baseUrl}/health`, {
    headers: { Origin: "https://untrusted.example" },
  });
  assert.equal(deniedOrigin.status, 403);

  const preflight = await fetch(`${baseUrl}/api/catalog/movie/search`, {
    method: "OPTIONS",
    headers: { Origin: "http://localhost:5173" },
  });
  assert.equal(preflight.status, 204);

  console.log("Gateway tests passed: health, query/page validation, route/method handling and CORS.");
} finally {
  child.kill("SIGTERM");
  await Promise.race([once(child, "exit"), delay(2_000)]);
}
