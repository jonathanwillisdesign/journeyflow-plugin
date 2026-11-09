---
name: journeyflow-workspace
description: How to find, read and safely change data in Journeyflow through its MCP tools. Use whenever the user mentions Journeyflow, a journey map, journey steps or stages, insights, evidence, opportunities, personas, studies or a Journeyflow workspace, or asks to look something up in, add something to, or update Journeyflow.
---

# Working in Journeyflow

Journeyflow is Big Motive's journey-mapping and research tool. The `journeyflow` MCP server gives you its data, always as the signed-in user, with their permissions enforced. If its tools are missing or return an auth error, tell the user to run `/mcp`, pick **journeyflow** and sign in.

Tool names below are short forms: the server exposes them with an `invoke_` prefix (e.g. `get_journey_context` is `invoke_get_journey_context`).

## Orient before you act

1. **Find the workspace.** Almost everything is scoped to a workspace. If the user hasn't named one, query `Workspace` with `query_records` (fields `id`, `name`) and confirm which one they mean. Don't guess between several.
2. **Search before you query.** For a topic or phrase, use `search_workspace` (journeys, insights, evidence, opportunities) with the `workspace_id`. It returns IDs you can then read in full.
3. **Read context in one call where you can.**
   - A journey and its stages, steps and related records: `get_journey_context` with `journey_id`; narrow with `stage_ids` or `step_ids` for big maps.
   - Insights with their supporting and contradicting evidence: `get_insight_context` with up to 10 `insight_ids`.
4. **Fall back to records.** `list_entity_types` shows what is exposed; `describe_entity` gives fields; `query_records` filters (default limit 50). Ask for only the fields you need.

## Vocabulary

| User says | Entity |
|---|---|
| journey, journey map | `JourneyMap` |
| stage / phase | `Stage`, `Phase` |
| step, card | `Card` |
| insight | `Insight` |
| evidence, quote, highlight | `Evidence` (linked via `EvidenceLink`) |
| opportunity, idea, solution | `Opportunity`, `Solution` |
| persona, user type | `Persona`, `UserType` |
| study, research session | `Study`, `Session` |

Check with `describe_entity` if a field you need isn't obvious; the schema evolves.

## Changing data

- Writes are real and visible to the whole team. Before `create_record`, `update_record` or `delete_record`, state what you'll change (entity, record, fields) and get a yes, unless the user has just asked for exactly that change.
- Read the record first, then update only the fields that change.
- Never delete without explicit confirmation naming the record.
- Images for a step: `upload_image`, then `attach_image` with the card's ID.
- Dovetail: `list_dovetail_projects`, then `sync_dovetail_project` with `workspace_id` and the project ID (optionally a `study_id`). Re-syncing is safe; it upserts.

## Reporting back

Quote record names, not just IDs. When you summarise research, keep the line between what the evidence says and your own interpretation clear, and cite the evidence.
