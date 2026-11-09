#!/usr/bin/env node
/** Build a ChatGPT web workspace ZIP bound to an existing approved MCP app. */
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const appId = process.argv[2];
const output = resolve(process.argv[3] ?? join(root, "dist/journeyflow-chatgpt-web.zip"));

if (!/^(?:asdk_app_|connector_|templated_apps_)[A-Za-z0-9][A-Za-z0-9_-]*$/.test(appId ?? "")) {
  console.error("Usage: node scripts/build-chatgpt-web.mjs <approved-app-id> [output.zip]");
  console.error("The app ID must start with asdk_app_, connector_, or templated_apps_.");
  process.exit(1);
}

const source = join(root, "plugins/journeyflow");
const manifest = JSON.parse(readFileSync(join(source, "plugin.json"), "utf8"));
manifest.extensions = {
  "com.openai": {
    apps: "./.app.json",
    interface: {
      displayName: "Journeyflow",
      shortDescription: "Journey mapping and research",
      longDescription: "Use Journeyflow journeys, personas, research and strategy in your workspace.",
      developerName: "Big Motive",
      category: "Productivity",
      capabilities: ["Read", "Write"],
      websiteURL: "https://joureny-flow.base44.app"
    }
  }
};

const temp = mkdtempSync(join(tmpdir(), "journeyflow-chatgpt-"));
try {
  const packaged = join(temp, "journeyflow");
  mkdirSync(packaged);
  cpSync(join(source, "skills"), join(packaged, "skills"), { recursive: true });
  writeFileSync(join(packaged, "plugin.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(packaged, ".app.json"), `${JSON.stringify({ apps: { journeyflow: { id: appId, required: true } } }, null, 2)}\n`);

  mkdirSync(dirname(output), { recursive: true });
  rmSync(output, { force: true });
  const zip = spawnSync("zip", ["-q", "-r", output, "journeyflow"], {
    cwd: temp,
    encoding: "utf8"
  });
  if (zip.error || zip.status !== 0) {
    throw new Error(zip.error?.message ?? zip.stderr ?? "zip failed");
  }
  console.log(output);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
