# Journeyflow agent plugins

Portable **Agent Plugins 1.0.0** package plus Claude-specific manifests. One `skills/` tree and one canonical `mcp.json`; install steps differ per tool. The ChatGPT web package is generated from those skills after a workspace admin registers the Journeyflow MCP server.

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
| [`scripts/build-chatgpt-web.mjs`](scripts/build-chatgpt-web.mjs) | Builds a ChatGPT web ZIP for an approved workspace app ID |

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

Journeyflow MCP URL: `https://joureny-flow.base44.app/api/mcp` (spelling is intentional). Every call runs as the signed-in user via Base44 OAuth. Connect the server in your agent, then sign in when prompted. The endpoint advertises the `app:mcp` and `offline` scopes through OAuth discovery; the portable MCP manifest declares both for OpenAI clients.

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

### ChatGPT web workspace (admin rollout)

ChatGPT web needs an approved **custom MCP app**. Importing this repository's bundled-MCP plugin directly can mark it **Desktop only**, even though the MCP URL is remote. The web ZIP built below contains the same skills and a reference to the approved app, without `mcp.json` or `.mcp.json`. See [OpenAI's marketplace import guidance](https://help.openai.com/en/articles/20001504-importing-and-syncing-plugin-marketplaces-from-github) and [custom MCP setup](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt).

1. In a ChatGPT Business or Enterprise/Edu workspace, an admin opens **Plugins → Add custom MCP server** and enters `https://joureny-flow.base44.app/api/mcp`. Use OAuth, complete sign-in, inspect the discovered tools, and test a read and a permitted write. Publish the app for the intended roles.
2. Copy the approved **app ID** from its admin URL or app details. It starts with `asdk_app_`, `connector_`, or `templated_apps_`; it is not the plugin ID.
3. From this repository, build the workspace-specific ZIP:

   ```bash
   node scripts/build-chatgpt-web.mjs <approved-app-id>
   ```

4. Upload `dist/journeyflow-chatgpt-web.zip` as a workspace plugin, review its required Journeyflow app and skills, then publish it to the intended roles. Members still sign in to Journeyflow individually. A different ChatGPT workspace needs a new ZIP built with **that workspace's** app ID.

The generated ZIP is ignored by Git. Do not commit an app ID or credentials to the portable plugin. If you only need the MCP tools and not the skills, stop after step 1.

### OpenAI Codex / ChatGPT desktop

The canonical `plugins/journeyflow` package includes the remote MCP server and shared skills for clients that install portable Agent Plugins. Codex desktop can also add a marketplace with `codex plugin marketplace add jonathanwillisdesign/journeyflow-plugin`; sign in to Journeyflow when prompted. A ChatGPT admin can import this repository through **Admin Console → Plugins → Add → Import marketplace**, but the bundled-MCP package may be limited to desktop. Use the web workflow above for ChatGPT web.

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

On a Team or Enterprise plan, an owner can upload a ZIP containing the `journeyflow/` plugin folder through **Organization settings → Plugins & skills → Add → Upload a plugin**. Build it from the repository root:

```bash
mkdir -p dist
cd plugins
zip -q -r ../dist/journeyflow-claude.zip journeyflow -x '*/.DS_Store'
```

Cowork and Skills must both be enabled. Set the installation preference (Available, Installed by default, or Required) and have each teammate connect Journeyflow with their own account. The remote MCP works in Claude chat as well as Cowork and Claude Code.

Claude's organization **GitHub sync requires a private or internal repository** on github.com; this repository is public. To use automatic sync, move or mirror the marketplace to a private/internal repository and configure it in the organization settings. Individual Claude Code users can still add this public repository with the command above. See [Claude's organization plugin guidance](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization).

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
4. Run `node scripts/validate-plugin.mjs` (and `claude plugin validate .` when the Claude CLI is available). For ChatGPT web, rebuild the ZIP with the approved workspace app ID.
5. Commit; teammates refresh their marketplace install per host.

## Adding a skill

Create `plugins/journeyflow/skills/<skill-name>/SKILL.md` with `name` and `description` frontmatter. Bump versions. Run the validator. No second copy under `.agents/` or `.cursor/` in this repo.
