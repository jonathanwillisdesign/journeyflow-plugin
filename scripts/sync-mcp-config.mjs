#!/usr/bin/env node
/**
 * Keeps Claude Code's .mcp.json in sync with the canonical Agent Plugins mcp.json.
 * Claude uses type "http"; the open standard uses "streamable-http" for remote MCP.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginDir = join(__dirname, "../plugins/journeyflow");
const canonicalPath = join(pluginDir, "mcp.json");
const claudePath = join(pluginDir, ".mcp.json");

const checkOnly = process.argv.includes("--check");

const canonical = JSON.parse(readFileSync(canonicalPath, "utf8"));
const claude = {
  mcpServers: {},
};

for (const [name, server] of Object.entries(canonical.mcpServers ?? {})) {
  const { type, url, headers } = server;
  if (!url) {
    console.error(`mcp.json: server "${name}" has no url (Claude sync only supports HTTP MCP).`);
    process.exit(1);
  }
  claude.mcpServers[name] = {
    type: "http",
    url,
    ...(headers ? { headers } : {}),
  };
}

const claudeText = `${JSON.stringify(claude, null, 2)}\n`;
const existing = readFileSync(claudePath, "utf8");

if (existing !== claudeText) {
  if (checkOnly) {
    console.error(
      "plugins/journeyflow/.mcp.json is out of date. Run: node scripts/sync-mcp-config.mjs",
    );
    process.exit(1);
  }
  writeFileSync(claudePath, claudeText);
  console.log("Wrote plugins/journeyflow/.mcp.json");
} else if (!checkOnly) {
  console.log("plugins/journeyflow/.mcp.json is already up to date.");
}
