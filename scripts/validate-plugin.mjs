#!/usr/bin/env node
/**
 * Cross-format plugin checks (Agent Plugins core + Claude/Cursor manifests).
 * Does not require the Claude CLI.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pluginDir = join(root, "plugins/journeyflow");
let failed = false;

function fail(msg) {
  console.error(msg);
  failed = true;
}

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(`${label}: invalid JSON (${path}): ${e.message}`);
    return null;
  }
}

const agentManifest = readJson(join(pluginDir, "plugin.json"), "Agent Plugins manifest");
if (agentManifest?.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") {
  fail("plugins/journeyflow/plugin.json: missing or wrong $schema");
}
if (!agentManifest?.name) {
  fail("plugins/journeyflow/plugin.json: missing name");
}

const mcp = readJson(join(pluginDir, "mcp.json"), "mcp.json");
if (mcp?.$schema !== "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json") {
  fail("plugins/journeyflow/mcp.json: missing or wrong $schema");
}
for (const [name, server] of Object.entries(mcp?.mcpServers ?? {})) {
  if (!["streamable-http", "sse", "stdio"].includes(server.type)) {
    fail(`mcp.json: server "${name}" has unsupported type "${server.type}"`);
  }
}

const sync = spawnSync(process.execPath, [join(__dirname, "sync-mcp-config.mjs"), "--check"], {
  stdio: "inherit",
});
if (sync.status !== 0) {
  failed = true;
}

const skillsDir = join(pluginDir, "skills");
for (const entry of readdirSync(skillsDir)) {
  const skillPath = join(skillsDir, entry, "SKILL.md");
  if (!statSync(join(skillsDir, entry)).isDirectory()) continue;
  const text = readFileSync(skillPath, "utf8");
  if (!/^---\n[\s\S]+?\n---\n/.test(text)) {
    fail(`${skillPath}: missing YAML frontmatter`);
  }
  if (!/^name:\s+\S+/m.test(text) || !/^description:\s+/m.test(text)) {
    fail(`${skillPath}: frontmatter needs name and description`);
  }
}

const claudePlugin = readJson(join(pluginDir, ".claude-plugin/plugin.json"), "Claude plugin");
const claudeMarket = readJson(join(root, ".claude-plugin/marketplace.json"), "Claude marketplace");
const codexPlugin = readJson(join(pluginDir, ".codex-plugin/plugin.json"), "Codex plugin");
if (claudePlugin?.version !== agentManifest?.version) {
  fail("Version mismatch: plugin.json vs .claude-plugin/plugin.json");
}
const marketEntry = claudeMarket?.plugins?.find((p) => p.name === "journeyflow");
if (marketEntry && marketEntry.version !== agentManifest?.version) {
  fail("Version mismatch: plugin.json vs .claude-plugin/marketplace.json");
}
if (codexPlugin?.version !== agentManifest?.version) {
  fail("Version mismatch: plugin.json vs .codex-plugin/plugin.json");
}
if (codexPlugin?.mcpServers !== "./.mcp.json") {
  fail(".codex-plugin/plugin.json: mcpServers must point to ./.mcp.json");
}

const cursorMarket = readJson(join(root, ".cursor-plugin/marketplace.json"), "Cursor marketplace");
const cursorEntry = cursorMarket?.plugins?.find((p) => p.name === "journeyflow");
if (cursorEntry && (cursorMarket.metadata?.version !== agentManifest?.version || cursorEntry.version !== agentManifest?.version)) {
  fail("Version mismatch: plugin.json vs .cursor-plugin/marketplace.json");
}

const claudeValidate = spawnSync("claude", ["plugin", "validate", "."], {
  cwd: root,
  stdio: "pipe",
  encoding: "utf8",
});
if (claudeValidate.error?.code === "ENOENT") {
  console.warn("Skipping claude plugin validate (claude CLI not installed).");
} else if (claudeValidate.status !== 0) {
  fail(`claude plugin validate failed:\n${claudeValidate.stderr || claudeValidate.stdout}`);
} else {
  console.log("claude plugin validate: OK");
}

if (failed) {
  process.exit(1);
}
console.log("validate-plugin: OK");
