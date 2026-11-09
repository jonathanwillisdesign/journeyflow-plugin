# Journeyflow agent plugins

Portable **Agent Plugins 1.0.0** package plus Claude-specific manifests. One `skills/` tree and one canonical `mcp.json`; install steps differ per tool.

## What ships

| Path | Purpose |
|---|---|
| [`plugins/journeyflow/plugin.json`](plugins/journeyflow/plugin.json) | Open [Agent Plugins](https://agent-plugins.org/) manifest (`$schema` 1.0.0) |
| [`plugins/journeyflow/mcp.json`](plugins/journeyflow/mcp.json) | MCP config (`streamable-http` → Journeyflow) |
| [`plugins/journeyflow/skills/`](plugins/journeyflow/skills/) | **Single source of truth** for all skills |
| [`plugins/journeyflow/.mcp.json`](plugins/journeyflow/.mcp.json) | Generated for Claude Code (`http` transport); do not edit by hand |
| [`plugins/journeyflow/.claude-plugin/`](plugins/journeyflow/.claude-plugin/) | Claude Code / Claude app plugin manifest |
| [`plugins/journeyflow/.codex-plugin/`](plugins/journeyflow/.codex-plugin/) | OpenAI Codex plugin manifest (see gaps below) |
| [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json) | Cursor multi-plugin repo catalogue |
| [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) | Claude marketplace catalogue |

### Skills

| Skill | Use it for |
|---|---|
| `journeyflow-workspace` | Base: workspaces, tools, query limits, confirming writes |
| `journey` | Scenarios, journeys, stages, steps, roles |
| `persona` | Personas, user types, roles, JTBD |
| `research` | Studies, evidence, themes, insights, research questions, Dovetail |
| `ux-ui` | Design needs, screen catalogue, media, design system, objects |
| `strategy` | Opportunities, approaches, dev specs, metrics, initiatives |

## MCP authentication

Journeyflow MCP URL: `https://joureny-flow.base44.app/api/mcp` (spelling is intentional). Every call runs as the signed-in user via Base44 OAuth. Connect the server in your agent, then sign in when prompted.

## Install

### Cursor (IDE, Agent, CLI)

Cursor loads **Agent Plugins** natively from a root `plugin.json` plus `skills/` and `mcp.json` ([plugins reference](https://cursor.com/docs/reference/plugins)).

1. **Team or marketplace:** Dashboard → Plugins & MCPs → **Import from Repo** → `jonathanwillisdesign/journeyflow-plugin` (needs [`.cursor-plugin/marketplace.json`](.cursor-plugin/marketplace.json)).
2. **Local test:** Copy or symlink `plugins/journeyflow` into `~/.cursor/plugins/local/journeyflow`, reload Cursor, open **Customize** → install/enable **journeyflow** and authenticate MCP.
3. **MCP only (no plugin):** Add to `.cursor/mcp.json` or user `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "journeyflow": {
      "url": "https://joureny-flow.base44.app/api/mcp"
    }
  }
}
```

Skills from the repo are **not** loaded until the plugin is installed (skills are not auto-imported from git alone).

### OpenAI Codex (CLI / desktop)

OpenAI documents **Codex plugins** with [`.codex-plugin/plugin.json`](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins), `skills` paths and `mcpServers` pointing at a plugin `.mcp.json`. Recent Codex builds also participate in the **Agent Plugins** ecosystem ([Speakeasy overview](https://www.speakeasy.com/blog/release-agent-plugins-support)); treat **`plugins/journeyflow/plugin.json`** as the portable entry when your Codex version supports it.

**Documented path today:** install the `plugins/journeyflow` folder as a Codex plugin (manifest under `.codex-plugin/`, shared `skills/` and `mcp.json`). Authenticate Journeyflow in Codex MCP settings.

**Manual fallback:** add the server to `~/.codex/config.toml` or a trusted repo’s `.codex/config.toml` (see [Codex manual](https://learn.chatgpt.com/docs/codex-manual)), then copy skills into `.agents/skills/` **only if** you are not using the plugin installer—avoid duplicating skill text; symlink or point at this repo instead.

**Gap:** There is no single published “install this GitHub repo” flow for all Codex surfaces yet; if plugin install is unavailable, use MCP + `.agents/skills` symlink to `plugins/journeyflow/skills`.

### Claude Code

Claude uses its own marketplace and **does not fully implement Agent Plugins yet** ([#88906](https://github.com/anthropics/claude-code/issues/88906)). Use the Claude manifests:

```
/plugin marketplace add jonathanwillisdesign/journeyflow-plugin
/plugin install journeyflow@journeyflow
```

Then `/mcp` → **journeyflow** → sign in.

Project rollout (`.claude/settings.json`):

```json
{
  "extraKnownMarketplaces": {
    "journeyflow": { "source": { "source": "github", "repo": "jonathanwillisdesign/journeyflow-plugin" } }
  },
  "enabledPlugins": { "journeyflow@journeyflow": true }
}
```

### Claude app (claude.ai / Desktop)

Publish `plugins/journeyflow` to the organisation plugin library. Teammates install from the library and connect Journeyflow when prompted.

### Other agents (OpenCode, etc.)

Any client that implements [Agent Plugins 1.0.0](https://agent-plugins.org/) should load `plugins/journeyflow/` as-is. If a client only supports loose skills, symlink `skills/` from that directory—do not fork skill content.

### Unsupported / unclear

- **GitHub Copilot / VS Code** without Cursor: no shared plugin format documented; use MCP config for your host plus a skills folder symlink if the host supports Agent Skills.
- **Windsurf and others:** only documented here when they ship Agent Plugins or MCP; otherwise MCP-only.

## Layout

```
.cursor-plugin/marketplace.json       # Cursor import catalogue
.claude-plugin/marketplace.json       # Claude catalogue
plugins/journeyflow/
  plugin.json                         # Agent Plugins (canonical)
  mcp.json                            # Agent Plugins MCP ($schema, streamable-http)
  .mcp.json                           # Synced for Claude (http)
  skills/<skill>/SKILL.md
  .claude-plugin/plugin.json
  .codex-plugin/plugin.json
scripts/
  sync-mcp-config.mjs                 # Regenerate .mcp.json from mcp.json
  validate-plugin.mjs                 # JSON + sync checks (claude CLI optional)
```

## Maintainer workflow

1. Edit skills only under `plugins/journeyflow/skills/`.
2. Change MCP in `plugins/journeyflow/mcp.json`, then run `node scripts/sync-mcp-config.mjs`.
3. Bump `version` in `plugin.json`, `.claude-plugin/plugin.json`, both marketplace files, and `.codex-plugin/plugin.json`.
4. Run `node scripts/validate-plugin.mjs` (and `claude plugin validate .` when the Claude CLI is available).
5. Commit; teammates refresh their marketplace install per host.

## Adding a skill

Create `plugins/journeyflow/skills/<skill-name>/SKILL.md` with `name` and `description` frontmatter. Bump versions. Run the validator. No second copy under `.agents/` or `.cursor/` in this repo.
