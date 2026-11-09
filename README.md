# Journeyflow Claude plugins

The Journeyflow Claude plugin marketplace. Add it once and the team gets Journeyflow access in Claude plus our shared skills, kept up to date from this repo.

## Plugins

| Plugin | What it does |
|---|---|
| [`journeyflow`](plugins/journeyflow) | Connects Claude to the Journeyflow MCP (`https://joureny-flow.base44.app/api/mcp`) and adds the skills below. |

### Skills

| Skill | Use it for |
|---|---|
| `journeyflow-workspace` | The base: finding workspaces and records, tool names, confirming before changes |
| `journey` | Briefing, critiquing, building and editing journey maps, current and future state |
| `persona` | Personas, mindsets, user types and JTBD, drafted from and checked against evidence |
| `research` | Planning studies, synthesising sessions, evidence, themes, insights, research questions, Dovetail |
| `ux-ui` | Design needs from research, UX critique, screen catalogue, screenshots, design system rules |
| `strategy` | Opportunities, prioritisation, solutions, initiatives, metrics, experiments, client recommendations |

## Install in the Claude app (claude.ai and Claude Desktop)

Publish the `plugins/journeyflow` folder to your organisation's plugin library on claude.ai. Once an admin approves it, teammates install it from the library and it works in chat and Cowork. Each person then connects Journeyflow when Claude first asks (or from the connector settings) and signs in with their own account.

## Install in Claude Code

```
/plugin marketplace add <path-or-github-repo>
/plugin install journeyflow@journeyflow
```

Use the local path while it lives on a Desktop (for example `~/Desktop/journeyflow-plugin`). Once it's on GitHub, use `owner/repo`.

Then run `/mcp`, select **journeyflow** and sign in with your Journeyflow account. Every call runs as you, with your Journeyflow permissions.

To roll it out to everyone automatically, add this to a project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "journeyflow": { "source": { "source": "github", "repo": "<owner>/<repo>" } }
  },
  "enabledPlugins": { "journeyflow@journeyflow": true }
}
```

## Layout

```
.claude-plugin/marketplace.json     # the catalogue: lists every plugin
plugins/
  journeyflow/
    .claude-plugin/plugin.json      # plugin manifest
    .mcp.json                       # Journeyflow MCP connection
    skills/<skill-name>/SKILL.md    # one folder per skill
```

## Adding a skill

1. Create `plugins/journeyflow/skills/<skill-name>/SKILL.md` with `name` and `description` frontmatter. The description decides when Claude uses it, so say what it does and the phrases that should trigger it.
2. Put long reference material in files beside `SKILL.md` and link to them, rather than one giant file.
3. Bump `version` in both `plugin.json` and `marketplace.json`.
4. Run `claude plugin validate .` from the repo root.
5. Teammates pick it up with `/plugin marketplace update journeyflow`.

## Adding a plugin

Skills that aren't about Journeyflow should go in their own plugin: create `plugins/<name>/` with the same layout and add an entry to `marketplace.json`.
